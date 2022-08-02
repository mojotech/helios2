defmodule HeliosWeb.WebHooks.SlackController do
  use HeliosWeb, :controller
  require JSON
  require Logger

  alias Helios.{Repo, Events.Event, Feed, SlackChannelNames}

  defp slack_bearer_token,
    do: Application.get_env(:helios, HeliosWeb.Endpoint)[:slack_bearer_token]

  defp upload_bearer_token,
    do: Application.get_env(:helios, HeliosWeb.Endpoint)[:upload_bearer_token]

  defp insert_channel_id(channel_id) do
    unless SlackChannelNames
           |> SlackChannelNames.with_id(channel_id)
           |> Repo.exists?() do
      body = %{
        "channel" => channel_id
      }

      request_body = URI.encode_query(body)

      headers = [
        {"Accept", "application/json"},
        {"Authorization", "Bearer #{slack_bearer_token()}"},
        {"Content-Type", "application/x-www-form-urlencoded"}
      ]

      channel_response =
        HTTPoison.post!("https://slack.com/api/conversations.info", request_body, headers,
          follow_redirect: true
        )

      json = Jason.decode!(channel_response.body)
      name = json["channel"]["name"]

      Repo.insert!(%SlackChannelNames{
        channel_id: channel_id,
        channel_name: name
      })
    end
  end

  defp send_message(channel_id, orig_channel, image_url) do
    headers = [
      {"Accept", "application/json"},
      {"Authorization", "Bearer #{upload_bearer_token()}"},
      {"Content-Type", "application/json"}
    ]

    body = %{
      channel: channel_id,
      text: "Submit your message to Helios feed images?",
      attachments: [
        %{
          image_url: image_url,
          fallback: "You are unable to submit photo to Helios",
          callback_id: "photo_submitted",
          color: "#3AA3E3",
          attachment_type: "default",
          actions: [
            %{
              name: "submit_photo",
              text: "Yes",
              type: "button",
              value: orig_channel
            },
            %{
              name: "submit_photo",
              text: "No",
              type: "button",
              value: "No"
            }
          ]
        }
      ]
    }

    {status, json_body} = JSON.encode(body)

    message_response =
      HTTPoison.post!("https://slack.com/api/chat.postMessage", json_body, headers,
        follow_redirect: true
      )

    Logger.info("message success/error: #{inspect(message_response)}")
  end

  def handle_interactive_message_response(conn, params) do
    {success, result} = JSON.decode(params["payload"])

    if result["type"] == "interactive_message" &&
         Enum.at(result["actions"], 0)["name"] == "submit_photo" &&
         Enum.at(result["actions"], 0)["value"] != "No" do
      channel_id = Enum.at(result["actions"], 0)["value"]
      user_id = result["user"]["id"]
      image_url = Enum.at(result["original_message"]["attachments"], 0)["image_url"]

      download_slack_image(image_url, channel_id, user_id)
      send_resp(conn, 200, "message added to helios")
    else
      send_resp(conn, 200, "message not added to helios")
    end
  end

  def download_slack_image(image_url, channel_id, user_id) do
    headers = [Authorization: "Bearer #{upload_bearer_token()}"]

    response = HTTPoison.post!(image_url, [], headers, follow_redirect: true)

    %{uuid: uuid} =
      Repo.insert!(%Feed{
        source: channel_id,
        author: user_id
      })

  end

  def handle(conn, params) do
    cond do
      params["type"] == "url_verification" ->
        send_resp(conn, 200, params["challenge"])

      params["payload"] ->
        handle_interactive_message_response(conn, params)

      true ->
        event = params["event"]
        img = event["files"]

        if img do
          mimetype = Enum.at(img, 0)["mimetype"]

          if mimetype == "image/png" || mimetype == "image/jpeg" do
            img_sender = event["user"]
            channel_id = event["channel"]
            image_url = Enum.at(img, 0)["url_private_download"]
            send_message(img_sender, channel_id, image_url)
          end
        end

        channel_id = params["event"]["channel"]
        insert_channel_id(channel_id)

        event_channel_name =
          SlackChannelNames
          |> SlackChannelNames.name_from_id(channel_id)
          |> Repo.one()

        unless Event
               |> Event.slack_messages()
               |> Event.with_external_id(event["event_ts"])
               |> Repo.exists?() do
          Repo.insert!(%Event{
            source: :slack_message,
            external_id: event["event_ts"],
            source_author: event["user"],
            source_channel: event_channel_name
          })
          |> publish
        end

        send_resp(conn, 200, "OK")
    end
  end

  defp publish(event) do
    Absinthe.Subscription.publish(
      HeliosWeb.Endpoint,
      event,
      event_published: "all"
    )
  end
end
