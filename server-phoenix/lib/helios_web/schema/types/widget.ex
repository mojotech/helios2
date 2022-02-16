defmodule HeliosWeb.Schema.Types.Widget do
  use Absinthe.Schema.Notation
  import_types(HeliosWeb.Schema.Types.EventCollection)

  object :widget do
    description("A single tab or panel of Helios")
    field(:id, :integer)
    field(:name, :string)
    field(:duration_seconds, :integer)
    field(:position, :integer)
    field(:sidebar_text, :string)
    field(:show_weather, :boolean)
    field(:location_id, :string)
  end

  object :guests_widget do
    field(:day_announcements, list_of(:announcement), description: "MojoTech announcements today")
  end

  object :weather_widget do
    field(:weather, :weather, description: "Weather response from Dark Sky")
  end

  object :twitter_widget do
    field(:tweets, list_of(:tweet), description: "Tweets from MojoTech")
  end

  object :numbers_widget do
    field(:events, :event_collection) do
      description("MojoTech slack/github events")
      arg(:after, :string)
      arg(:type, :event_source)
    end
  end

  object :events_widget do
  end

  object :traffic_widget do
    field(:traffic_cams, list_of(:traffic_cam))
  end
end
