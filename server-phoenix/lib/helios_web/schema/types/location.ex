defmodule HeliosWeb.Schema.Types.Location do
  use Absinthe.Schema.Notation

  object :location do
    field(:id, :id)
    field(:latitude, :float)
    field(:longitude, :float)
    field(:time_zone, :string)
    field(:city_name, :string)
    field(:is_primary, :boolean)
    field(:weather, :weather)
    field(:day_announcements, list_of(:announcement))
    field(:widgets, :widget_collection)
    field(:moon_phase, :float)
    field(:solar_cycles, list_of(:solarcycle))
    field(:wifi_name, :string)
    field(:wifi_password, :string)
    field(:bathroom_code, :string)
    field(:traffic_cams, list_of(:traffic_cam))
  end
end
