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

  def happen_today(query, _time_zone) do
    today = DateTime.utc_now()
    # When DB is changed to Postgres (UTC -> Naive Time zone), the following code will be used:
    # today = elem(DateTime.now(time_zone), 1)
    tomorrow = DateTime.add(today, 86400)
    from q in query, where: q.publish_on == fragment("?", ^today) and fragment("?", ^tomorrow)
  end
end
