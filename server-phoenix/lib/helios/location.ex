defmodule Helios.Location do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :id, autogenerate: true}
  schema "locations" do
    field :latitude, :float, presence: true
    field :longitude, :float, presence: true
    field :city_name, :string, presence: true, uniqueness: true
    field :time_zone, :string, presence: true
    field :created_at, :utc_datetime, presence: true
    field :updated_at, :utc_datetime, presence: true
    field :wifi_name, :string
    field :wifi_password, :string
    field :bathroom_code, :string

    has_many :announcements, Helios.Announcement
    has_many :traffic_cams, Helios.TrafficCam
    has_many :widgets, Helios.Widget
  end
end
