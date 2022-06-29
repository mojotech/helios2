defmodule HeliosWeb.WebHooks.SlackController do
  use HeliosWeb, :controller

  alias Helios.{Repo, Event, SlackChannelNames}

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

  def handle(conn, params) do
    if params["type"] == "url_verification" do
      send_resp(conn, 200, params["challenge"])
    else
      event = params["event"]
      img = params["event"]["files"]

      if img do
        url = Enum.at(img, 0)["url_private_download"]

        headers = [Authorization: "Bearer #{slack_bearer_token()}"]

        Task.Supervisor.start_child(
          SlackImageDownloader,
          fn ->
            HTTPoison.post!(url, [], headers, follow_redirect: true)
          end
        )
      end

      channel_id = params["event"]["channel"]

      insert_channel_id(channel_id)

      unless Event
             |> Event.slack_messages()
             |> Event.with_external_id(event["event_ts"])
             |> Repo.exists?() do
        Repo.insert!(%Event{
          source: :slack_message,
          external_id: event["event_ts"],
          source_author: event["user"]
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
