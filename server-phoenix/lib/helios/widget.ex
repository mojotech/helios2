defmodule Helios.Widget do
  use Ecto.Schema
  import Ecto.Changeset
  alias Helios.{Repo, Location}
  import Ecto.Query

  @primary_key {:id, :id, autogenerate: true}
  schema "widgets" do
    field :name, :string, presence: true
    field :enabled, :boolean, presence: true
    field :duration_seconds, :integer, presence: true
    field :position, :integer, presence: true
    field :start, :time
    field :stop, :time
    field :sidebar_text, :string
    field :show_weather, :boolean
    timestamps(inserted_at: :created_at, type: :utc_datetime)

    belongs_to :location, Location
  end

  def with_location(query, location) do
    from q in query, where: q.location_id == ^location.id
  end

  def enabled(query) do
    from q in query, where: q.enabled
  end

  def available(query, time) when is_binary(time) do
    case DateTime.from_iso8601(time) do
      {:ok, datetime, _} -> available(query, datetime)
      _ -> raise ArgumentError, message: "the argument value is invalid"
    end
  end

  def available(query, time) do
    tod = DateTime.to_time(time)

    from q in query,
      where: (q.start <= ^tod or is_nil(q.start)) and (q.stop >= ^tod or is_nil(q.stop))
  end

  def next(query, current_id) do
    current_position = from q in query, where: q.id == ^current_id, select: q.position, limit: 1

    from q in query,
      join: s in subquery(current_position),
      where: q.position > s.position,
      order_by: q.position,
      limit: 1
  end

  def default(query) do
    from q in query, order_by: q.position, limit: 1
  end
end
