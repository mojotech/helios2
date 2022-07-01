defmodule Helios.Events.DailyEventSummary do
  use Ecto.Schema

  import Ecto.Changeset
  import Ecto.Query

  alias Helios.Repo
  alias Helios.Events.DailyEventSummary

  schema "daily_event_summaries" do
    field :source, :string
    field :day, :date
    field :count, :integer

    timestamps()
  end

  def changeset(daily_event_summary, attrs \\ %{}) do
    daily_event_summary
    |> cast(attrs, [:source, :day, :count])
    |> validate_required([:source, :day, :count])
  end

  def archive!(event_scope) do
    event_scope
    |> group_by([e], e.source)
    |> group_by([e], fragment("day"))
    |> select([e], %{
      source: e.source,
      day: fragment("date(inserted_at) as day"),
      count: count(e.id)
    })
    |> Repo.all()
    |> Enum.each(fn %{source: source, day: day, count: count} ->
      Repo.insert(%DailyEventSummary{
        source: Atom.to_string(source),
        day: Date.from_iso8601!(day),
        count: count
      })
    end)

    event_scope |> Repo.delete_all()
  end
end
