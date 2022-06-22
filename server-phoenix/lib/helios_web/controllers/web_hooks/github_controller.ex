defmodule HeliosWeb.WebHooks.GithubController do
  use HeliosWeb, :controller
  alias Helios.{Repo, Event}

  def handle(conn, params) do
    [event_source] = get_req_header(conn, "x-github-event")

    case event_source do
      "pull_request" ->
        github_pull_request(params)

      "push" ->
        github_push(params)
    end

    send_resp(conn, 200, "OK")
  end

  defp github_pull_request(payload) do
    pull_request = payload["pull_request"]

    unless Event
           |> Event.pull_requests()
           |> Event.with_external_id(pull_request["id"])
           |> Repo.exists?() do
      Repo.insert!(%Event{
        source: :github_pull,
        external_id: pull_request["id"],
        source_author: pull_request["user"]["login"]
      })
      |> publish
    end
  end

  defp github_push(payload) do
    branch_pushed_to = payload["ref"] |> String.split("/") |> Enum.drop(2) |> Enum.join("/")

    if payload["repository"]["default_branch"] == branch_pushed_to do
      Enum.each(payload["commits"], fn commit ->
        unless(
          Event
          |> Event.commits()
          |> Event.with_external_id(commit["id"])
          |> Repo.exists?()
        ) do
          Repo.insert!(%Event{
            source: :github_commit,
            external_id: commit["id"],
            source_author: commit["author"]["name"]
          })
          |> publish
        end
      end)
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
