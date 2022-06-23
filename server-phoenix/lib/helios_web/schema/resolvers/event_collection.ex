defmodule HeliosWeb.Schema.Resolvers.EventCollection do
  alias Helios.{Repo, Event}

  def events(_parent, args, _info) do
    event_query =
      case args do
        %{type: type} ->
          Event
          |> Event.with_source(type)

        %{created_after: created_after} ->
          Event
          |> Event.created_after(created_after)

        %{created_after: created_after, type: type} ->
          Event
          |> Event.with_source(type)
          |> Event.created_after(created_after)

        %{} ->
          Event
      end

    {:ok, event_query}
  end

  def all(parent, _args, _info) do
    {:ok, Repo.all(parent)}
  end

  def by_author(parent, args, _info) do
    {:ok,
     parent
     |> Event.top_commits_by_author(Map.get(args, :top, nil))
     |> Repo.all()}
  end

  def count(parent, _args, _info) do
    {:ok,
     parent
     |> Event.count()
     |> Repo.all()
     |> Enum.into(%{github_pull: 0, github_commit: 0, slack_message: 0})}
  end
end
