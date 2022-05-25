defmodule Helios.Widget do
  use Ecto.Schema

  import Ecto.Changeset
  import Ecto.Query

  alias Helios.{Repo, Location}

  @required_fields [:name, :enabled, :duration_seconds, :position]

  @optional_fields [:start, :stop, :sidebar_text, :show_weather]

  @fields @required_fields ++ @optional_fields

  @primary_key {:id, :id, autogenerate: true}
  schema "widgets" do
    belongs_to :location, Location

    field :name, :string
    field :enabled, :boolean
    field :duration_seconds, :integer
    field :position, :integer
    field :start, :time
    field :stop, :time
    field :sidebar_text, :string
    field :show_weather, :boolean

    timestamps(inserted_at: :inserted_at, type: :utc_datetime)
  end

  def changeset(widget, attrs \\ %{}) do
    widget
    |> cast(attrs, @fields)
    |> validate_required(@required_fields)
  end

  def with_location(query, location) do
    from(q in query, where: q.location_id == ^location.id)
  end

  def enabled(query) do
    from(q in query, where: q.enabled)
  end

  def available(query, time) when is_binary(time) do
    case DateTime.from_iso8601(time) do
      {:ok, datetime, _} -> available(query, datetime)
      _ -> raise ArgumentError, message: "the argument value is invalid"
    end
  end

  def available(query, time) do
    tod = DateTime.to_time(time)

    from(q in query,
      where: (q.start <= ^tod or is_nil(q.start)) and (q.stop >= ^tod or is_nil(q.stop))
    )
  end

  def next(query, current_id) do
    current_position = from(q in query, where: q.id == ^current_id, select: q.position, limit: 1)

    from(q in query,
      join: s in subquery(current_position),
      where: q.position > s.position,
      order_by: q.position,
      limit: 1
    )
  end

  def default(query) do
    from(q in query, order_by: q.position, limit: 1)
  end
end
