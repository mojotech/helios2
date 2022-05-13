defmodule Helios.Announcement do
  use Ecto.Schema
  import Ecto.Changeset
  import Ecto.Query
  alias Helios.Location

  @primary_key {:id, :id, autogenerate: true}
  schema "announcements" do
    field :publish_on, :utc_datetime, presence: true
    field :message, :string
    field :people, :string, presence: true
    field :company, :string
    field :announcement_id, :string, presence: true
    timestamps(inserted_at: :created_at, type: :utc_datetime)

    belongs_to :location, Location
  end

  def with_location(query, location) do
    from q in query, where: q.location == ^location
  end

  def happen_today(query, time_zone) do
    {:ok, today} = DateTime.now(time_zone)
    tomorrow = DateTime.add(today, 86400)

    from q in query,
      where: q.publish_on > fragment("?", ^today) and q.publish_on < fragment("?", ^tomorrow)
  end
end
