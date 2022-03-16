defmodule HeliosWeb.Schema.Types.Widget do
  use Absinthe.Schema.Notation

  alias HeliosWeb.Schema.Resolvers.EventCollection
  alias HeliosWeb.Schema.Resolvers.Widget

  defp resolve_widget(obj, _ctx) do
    widgets = %{
      "Guests" => :guests_widget,
      "Weather" => :weather_widget,
      "Twitter" => :twitter_widget,
      "Numbers" => :numbers_widget,
      "Traffic" => :traffic_widget,
      "Events" => :events_widget
    }

    widgetName = obj.name

    unless Map.has_key?(widgets, widgetName) do
      raise "Unexpected WidgetType"
    end

    widgets[widgetName]
  end

  interface :widget do
    description("A single tab or panel of Helios")
    field(:id, non_null(:integer))
    field(:name, non_null(:string))
    field(:duration_seconds, non_null(:integer))
    field(:position, non_null(:integer))
    field(:sidebar_text, :string)
    field(:show_weather, :boolean)
    field(:location_id, non_null(:string))

    resolve_type(&resolve_widget/2)
  end

  object :guests_widget do
    interface(:widget)

    field(:id, non_null(:integer))
    field(:name, non_null(:string))
    field(:duration_seconds, non_null(:integer))
    field(:position, non_null(:integer))
    field(:sidebar_text, :string)
    field(:show_weather, :boolean)
    field(:location_id, non_null(:string))

    field :day_announcements, non_null(list_of(:announcement)) do
      description("MojoTech announcements today")
      resolve(&Widget.day_announcements/3)
    end
  end

  object :weather_widget do
    interface(:widget)

    field(:id, non_null(:integer))
    field(:name, non_null(:string))
    field(:duration_seconds, non_null(:integer))
    field(:position, non_null(:integer))
    field(:sidebar_text, :string)
    field(:show_weather, :boolean)
    field(:location_id, non_null(:string))

    field :weather, non_null(:weather) do
      description("Weather response from Dark Sky")
      resolve(&Widget.weather/3)
    end
  end

  object :twitter_widget do
    interface(:widget)

    field(:id, non_null(:integer))
    field(:name, non_null(:string))
    field(:duration_seconds, non_null(:integer))
    field(:position, non_null(:integer))
    field(:sidebar_text, :string)
    field(:show_weather, :boolean)
    field(:location_id, non_null(:string))

    field :tweets, non_null(list_of(:tweet)) do
      description("Tweets from MojoTech")
      resolve(&Widget.tweets/3)
    end
  end

  object :numbers_widget do
    interface(:widget)

    field(:id, non_null(:integer))
    field(:name, non_null(:string))
    field(:duration_seconds, non_null(:integer))
    field(:position, non_null(:integer))
    field(:sidebar_text, :string)
    field(:show_weather, :boolean)
    field(:location_id, non_null(:string))

    field :events, :event_collection do
      description("MojoTech slack/github events")
      arg(:after, :string)
      arg(:type, :event_source)
      resolve(&EventCollection.events/3)
    end
  end

  object :events_widget do
    interface(:widget)

    field(:id, non_null(:integer))
    field(:name, non_null(:string))
    field(:duration_seconds, non_null(:integer))
    field(:position, non_null(:integer))
    field(:sidebar_text, :string)
    field(:show_weather, :boolean)
    field(:location_id, non_null(:string))
  end

  object :traffic_widget do
    interface(:widget)

    field(:id, non_null(:integer))
    field(:name, non_null(:string))
    field(:duration_seconds, non_null(:integer))
    field(:position, non_null(:integer))
    field(:sidebar_text, :string)
    field(:show_weather, :boolean)
    field(:location_id, non_null(:string))

    field :traffic_cams, non_null(list_of(:traffic_cam)) do
      resolve(&Widget.traffic_cams/3)
    end
  end
end
