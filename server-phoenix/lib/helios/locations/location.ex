defmodule Helios.Locations.Location do
  use Ecto.Schema

  import Ecto.Changeset
  import Ecto.Changeset

  alias Helios.{Events.Announcement, Widgets.TrafficCam, Widgets.Widget}

  @required_fields [:latitude, :longitude, :city_name, :time_zone]

  @optional_fields [:bathroom_code, :wifi_name, :wifi_password]

  @fields @required_fields ++ @optional_fields

  @primary_key {:id, :id, autogenerate: true}

  schema "locations" do
    has_many :announcements, Announcement
    has_many :traffic_cams, TrafficCam
    has_many :widgets, Widget

    field :latitude, :float
    field :longitude, :float
    field :city_name, :string
    field :time_zone, :string
    field :wifi_name, :string
    field :wifi_password, :string
    field :bathroom_code, :string

    timestamps()
  end

  def changeset(location, attrs \\ %{}) do
    location
    |> cast(attrs, @fields)
    |> validate_required(@required_fields)
    |> unique_constraint(:city_name)
  end

  def time_now(%{time_zone: time_zone}) do
    DateTime.now!(time_zone)
  end
end
