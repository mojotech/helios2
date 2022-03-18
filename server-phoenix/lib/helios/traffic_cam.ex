defmodule Helios.TrafficCam do
  use Ecto.Schema
  alias Helios.Location
  import Ecto.Query

  @primary_key {:id, :id, autogenerate: true}
  schema "traffic_cams" do
    field :title, :string, presence: true
    field :url, :string, presence: true
    field :feed_format, :string, presence: true
    timestamps(inserted_at: :created_at, type: :utc_datetime)

    belongs_to :location, Location
  end

  def with_location(query, location) do
    from q in query, where: q.location_id == ^location.id
  end
end
