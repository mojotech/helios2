defmodule Helios.Event do
  use Ecto.Schema

  import Ecto.Changeset
  import Ecto.Query

  schema "events" do
    field :source, Ecto.Enum, values: [:github_commit, :github_pull, :slack_message]
    field :external_id, :string
    field :source_author, :string
    field :source_channel, :string

    timestamps()
  end

  def changeset(event, attrs \\ %{}) do
    event
    |> cast(attrs, [:source, :external_id])
  end

  def with_source(query, source) do
    from(q in query, where: q.source == ^source)
  end

  def created_after(query, c_after) when is_binary(c_after) do
    case DateTime.from_iso8601(c_after) do
      {:error, msg} ->
        raise msg

      {:ok, result, _} ->
        created_after(query, result)
    end
  end

  def created_after(query, c_after) when is_struct(c_after) do
    from(q in query, where: q.inserted_at > ^c_after)
  end

  def pull_requests(query) do
    from(q in query, where: q.source == :github_pull)
  end

  def commits(query) do
    from(q in query, where: q.source == :github_commit)
  end

  def slack_messages(query) do
    from(q in query, where: q.source == :slack_message)
  end

  def with_external_id(query, external_id) do
    from(q in query, where: q.external_id == ^external_id)
  end

  def before_beginning_of_week(query) do
    bow = Date.to_iso8601(Date.utc_today() |> Date.beginning_of_week()) <> " " <> "00:00:00Z"
    bow = elem(DateTime.from_iso8601(bow), 1)
    from(q in query, where: q.inserted_at < ^bow)
  end

  def top_commits_by_author(query, top) do
    from(q in query,
      group_by: q.source_author,
      select: %{
        count: fragment("count(?) as count", q.source_author),
        source_author: q.source_author
      },
      order_by: [desc: fragment("count")],
      limit: ^top
    )
  end

  def count(query) do
    from(e in query, group_by: e.source, select: {e.source, count(e.source)})
  end
end
