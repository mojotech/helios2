defmodule Helios.TrafficCam do
  use Ecto.Schema
  alias Helios.Location

  @primary_key {:id, :id, autogenerate: true}
  schema "traffic_cams" do
    field :title, :string, presence: true
    field :url, :string, presence: true
    field :feed_format, :string, presence: true
    timestamps([inserted_at: :created_at, type: :utc_datetime])

    belongs_to :location, Location
  end
end
