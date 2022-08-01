defmodule HeliosWeb.WebHooks.SlackController do
  use HeliosWeb, :controller
  require JSON

  alias Helios.{Repo, Events.Event, SlackChannelNames}

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

  defp send_message(channel_id, image_url) do
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
              value: "Yes"
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

    HTTPoison.post!("https://slack.com/api/chat.postMessage", json_body, headers,
      follow_redirect: true
    )
  end

  def handle_interactive_message_response(conn, params) do
    {success, result} = JSON.decode(params["payload"])

    if result["type"] == "interactive_message" &&
         Enum.at(result["actions"], 0)["name"] == "submit_photo" &&
         Enum.at(result["actions"], 0)["value"] == "Yes" do
      send_resp(conn, 200, "message added to helios")
    else
      send_resp(conn, 200, "message not added to helios")
    end
  end

  def download_slack_image(params) do
    img = params["event"]["files"]

    if img do
      image_url = Enum.at(img, 0)["url_private_download"]
      send_message(params["event"]["user"], image_url)

      headers = [Authorization: "Bearer #{upload_bearer_token()}"]

      Task.Supervisor.start_child(
        SlackImageDownloader,
        fn ->
          HTTPoison.post!(image_url, [], headers, follow_redirect: true)
        end
      )
    end
  end

  def handle(conn, params) do
    cond do
      params["type"] == "url_verification" ->
        send_resp(conn, 200, params["challenge"])

      params["payload"] ->
        handle_interactive_message_response(conn, params)

      true ->
        event = params["event"]
        download_slack_image(params)

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
