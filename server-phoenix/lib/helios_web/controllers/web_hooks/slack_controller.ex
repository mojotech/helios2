defmodule HeliosWeb.WebHooks.SlackController do
  use HeliosWeb, :controller
  alias Helios.{Repo, Event}
  defp slack_bearer_token, do: System.get_env("SLACK_BEARER_TOKEN")

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
            try do
              response = HTTPoison.post!(url, [], headers, follow_redirect: true)
            rescue
              e -> IO.inspect(e)
            end
          end
        )
      end

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
