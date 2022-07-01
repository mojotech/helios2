defmodule Helios.Widgets.TrafficCam do
  use Ecto.Schema

  import Ecto.Changeset
  import Ecto.Query

  alias Helios.Locations.Location

  @primary_key {:id, :id, autogenerate: true}
  schema "traffic_cams" do
    belongs_to :location, Location

    field :title, :string
    field :url, :string
    field :feed_format, :string

    timestamps()
  end

  def changeset(traffic_cam, attrs \\ %{}) do
    traffic_cam
    |> cast(attrs, [:title, :url, :feed_format])
    |> validate_required([:title, :url, :feed_format])
  end

  def with_location(query, location) do
    from(q in query, where: q.location_id == ^location.id)
  end
end
