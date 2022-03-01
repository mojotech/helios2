defmodule HeliosWeb.Schema.Types.Location do
  use Absinthe.Schema.Notation

  alias HeliosWeb.Schema.Resolvers.Location

  object :location do
    field(:id, non_null(:id))
    field(:latitude, non_null(:float))
    field(:longitude, non_null(:float))
    field(:time_zone, non_null(:string))
    field(:city_name, non_null(:string))
    field :is_primary, non_null(:boolean) do
      resolve(&Location.primary?/3)
    end
    field :weather, non_null(:weather) do
      resolve(&Location.weather/3)
    end
    field :day_announcements, non_null(list_of(:announcement)) do
      resolve(&Location.day_announcements/3)
    end
    field :widgets, non_null(:widget_collection) do
      resolve fn _, _, _ -> {:ok, %{}} end
    end
    field :moon_phase, non_null(:float) do
      resolve(&Location.moon_phase/3)
    end
    field :solar_cycles, non_null(list_of(:solarcycle)) do
      resolve(&Location.solar_cycles/3)
    end
    field(:wifi_name, :string)
    field(:wifi_password, :string)
    field(:bathroom_code, :string)
    field(:traffic_cams, non_null(list_of(:traffic_cam)))
  end
end
