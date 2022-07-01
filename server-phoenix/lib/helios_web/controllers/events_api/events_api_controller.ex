defmodule HeliosWeb.EventsAPI.EventsAPIController do
  use HeliosWeb, :controller
  alias Helios.{Repo, Events.Event}

  def handle(conn, params) do
    cond do
      params["version"] == "1" -> api_v1(conn, params)
      true -> send_resp(conn, 404, "Not Found")
    end
  end

  defp api_v1(conn, params) do
    case params["event_type"] do
      "github_commit" ->
        post_event(
          conn,
          Event.commits(Event),
          :github_commit,
          params["event_id"],
          params["author"]
        )

      "github_pr" ->
        post_event(
          conn,
          Event.pull_requests(Event),
          :github_pull,
          params["event_id"],
          params["author"]
        )

      _ ->
        send_resp(conn, 400, "Bad Request")
    end
  end

  defp post_event(conn, source_type_query, source, external_id, source_author) do
    unless(
      source_type_query
      |> Event.with_external_id(external_id)
      |> Repo.exists?()
    ) do
      Repo.insert!(%Event{
        source: source,
        external_id: external_id,
        source_author: source_author
      })
      |> publish

      send_resp(conn, 201, "Created")
    else
      send_resp(conn, 208, "Already Reported")
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
