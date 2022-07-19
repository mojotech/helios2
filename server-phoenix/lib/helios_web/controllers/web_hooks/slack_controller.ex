defmodule HeliosWeb.WebHooks.SlackController do
  use HeliosWeb, :controller
  require Logger
  #use Avatar
  alias Helios.{Repo, Event, Feed}
  defp slack_bearer_token, do: System.get_env("SLACK_BEARER_TOKEN")
  def handle(conn, params) do
    if params["type"] == "url_verification" do
      send_resp(conn, 200, params["challenge"])
    else
      event = params["event"]
      img = params["event"]["files"]
      Logger.info "file type: #{inspect img}"
      if (img) do
        if (Enum.at(img,0)["mimetype"] == "image/png") do
          url = Enum.at(img,0)["url_private_download"]
          headers = ["Authorization": "Bearer #{slack_bearer_token()}"]

        #Logger.info "user id: #{inspect Enum.at(params["authorizations"],0)["user_id"]}"
        #Logger.info "channel: #{inspect params["event"]["channel"]}"
        #Logger.info "file name: #{inspect Enum.at(params["event"]["files"],0)["title"]}"
          Task.Supervisor.start_child(MyTaskSupervisor,
            fn ->
            try do
              response = HTTPoison.post!(url, [], headers, follow_redirect: true)
              #Logger.info "post response: #{inspect response}"
              #map = %{"binary" => response.body, filename: "image_from_post.png"}
              #Logger.info "map? : #{inspect map}"
              scope = Repo.get(Feed,1)
              Logger.info "scope? : #{inspect scope}"
              res = Helios.Avatar.store({%{binary: response.body, filename: Enum.at(params["event"]["files"],0)["title"]}, scope})

              Logger.info "res? : #{inspect res}"

              Repo.insert!(%Feed{
                source: params["event"]["channel"],
                author: Enum.at(params["authorizations"],0)["user_id"],
                file_url: Enum.at(params["event"]["files"],0)["title"]
              })

            rescue
              e -> IO.inspect(e)
            end
          end)
        else
          Logger.info "file attached but not image"
        end

      else

        Logger.info "no file attached"

      end


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
