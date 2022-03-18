defmodule HeliosWeb.WebHooks.SlackController do
  use HeliosWeb, :controller
  alias Helios.{Repo, Event}

  def handle(conn, params) do
    if params["type"] == "url_verification" do
      send_resp(conn, 200, params["challenge"])
    else
      event = params["event"]

      unless Event
             |> Event.slack_messages()
             |> Event.with_external_id(event["event_ts"])
             |> Repo.exists?() do
        Repo.insert!(%Event{
          source: :slack_message,
          external_id: event["event_ts"]
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
