defmodule Helios.TrafficCam do
  use Ecto.Schema
  alias Helios.Location

  @primary_key {:id, :id, autogenerate: true}
  schema "traffic_cams" do
    field :title, :string, presence: true
    field :url, :string, presence: true
    field :created_at, :utc_datetime, presence: true
    field :updated_at, :utc_datetime, presence: true
    field :feed_format, :string, presence: true

    belongs_to :location, Location
  end
end
