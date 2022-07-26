defmodule HeliosWeb.WebHooks.SlackController do
  use HeliosWeb, :controller
  require JSON

  alias Helios.{Repo, Events.Event, SlackChannelNames}

  defp slack_bearer_token,
    do: Application.get_env(:helios, HeliosWeb.Endpoint)[:slack_bearer_token]

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


  def download_slack_image(params) do
    img = params["event"]["files"]

    if img do
      image_url = Enum.at(img, 0)["url_private_download"]

      headers = [Authorization: "Bearer #{slack_bearer_token()}"]

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
