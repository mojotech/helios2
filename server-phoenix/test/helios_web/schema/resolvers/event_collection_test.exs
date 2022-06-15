defmodule HeliosWeb.Schema.Resolvers.EventCollectionTest do
  use HeliosWeb.ConnCase, async: true
  use ExUnit.Case
  alias Helios.Event
  alias Helios.Repo

  test "getting authors by # of contributions, AUTHORS: top 2 of 3" do
    insert_event(:github_pull, "279147430", "RVRX")
    insert_event(:github_commit, "279147431", "RVRX")
    insert_event(:github_commit, "279147432", "RVRX")
    insert_event(:github_pull, "279147433", "RVRX")
    insert_event(:slack_message, "279147434", "Cole Manning")
    insert_event(:github_pull, "279147435", "Cole Manning")
    insert_event(:slack_message, "279147436", "Cole Manning")
    insert_event(:github_pull, "279147437", "another 2")
    insert_event(:github_pull, "279147438", "another 2")

    top_events = Event |> Event.top_commits_by_author(2) |> Repo.all()

    assert top_events == [
             %{count: 4, source_author: "RVRX"},
             %{count: 3, source_author: "Cole Manning"}
           ]
  end

  test "getting authors by # of contributions, AUTHORS: all" do
    insert_event(:github_pull, "279147430", "RVRX")
    insert_event(:github_commit, "279147432", "RVRX")
    insert_event(:github_commit, "279147433", "RVRX")
    insert_event(:slack_message, "279147434", "Cole Manning")
    insert_event(:github_pull, "279147437", "another 2")
    insert_event(:github_pull, "279147438", "another 2")

    top_events = Event |> Event.top_commits_by_author(nil) |> Repo.all()

    assert top_events == [
             %{count: 3, source_author: "RVRX"},
             %{count: 2, source_author: "another 2"},
             %{count: 1, source_author: "Cole Manning"}
           ]
  end

  defp insert_event(source, id, author) do
    Repo.insert!(%Event{
      source: source,
      external_id: id,
      source_author: author
    })
  end
end
