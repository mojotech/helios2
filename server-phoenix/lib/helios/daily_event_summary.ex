defmodule Helios.DailyEventSummary do
  use Ecto.Schema
  import Ecto.Query
  alias Helios.{Repo, DailyEventSummary}

  schema "daily_event_summaries" do
    field :source, :string, presence: true
    field :day, :date, presence: true
    field :count, :integer, presence: true
    timestamps([inserted_at: :created_at, type: :utc_datetime])
  end

  def archive!(event_scope) do
    event_scope
      |> group_by([e], e.source)
      |> group_by([e], fragment("day"))
      |> select([e], %{source: e.source, day: fragment("date(created_at) as day"), count: count(e.id)})
      |> Repo.all()
      |> Enum.each(fn (%{source: source, day: day, count: count}) -> Repo.insert(
      %DailyEventSummary {
        source: Atom.to_string(source),
        day: Date.from_iso8601!(day),
        count: count
      }) end)

    event_scope |> Repo.delete_all
  end
end
