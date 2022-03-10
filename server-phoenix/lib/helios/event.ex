defmodule Helios.Event do
  use Ecto.Schema
  import Ecto.Query

  schema "events" do
    field :source, Ecto.Enum, values: [:github_commit, :github_pull, :slack_message]
    field :external_id, :string
    timestamps([inserted_at: :created_at, type: :utc_datetime])
  end

  def with_source(query, source) do
    from q in query, where: q.source == ^source
  end

  def created_after(query, c_after) do
    from q in query, where: q.created_at > ^c_after
  end

  def pull_requests(query) do
    from q in query, where: q.source == :github_pull
  end

  def commits(query) do
    from q in query, where: q.source == :github_commit
  end

  def slack_messages(query) do
    from q in query, where: q.source == :slack_message
  end

  def with_external_id(query, external_id) do
    from q in query, where: q.external_id == ^external_id
  end

  def before_beginning_of_week(query) do
    bow = Date.to_iso8601(Date.utc_today() |> Date.beginning_of_week) <> " " <> "00:00:00Z"
    bow = elem(DateTime.from_iso8601(bow), 1)
    from q in query, where: q.created_at < ^bow
  end
end
