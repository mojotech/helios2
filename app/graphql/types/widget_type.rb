module Types::WidgetType
  include Types::BaseInterface

  description "A single tab or panel of Helios"
  graphql_name "Widget"

  field "id", Integer, null: false
  field "name", String, null: false
  field "duration_seconds", Integer, null: false
  field "position", Integer, null: false
  field "sidebar_text", String, null: true
  field "show_weather", Boolean, null: true
  field "location_id", Integer, null: false

  definition_methods do
    def resolve_type(obj, _ctx)
      widgets = { 'Guests' => Types::GuestsWidget, 'Weather' => Types::WeatherWidget,
                  'Twitter' => Types::TwitterWidget, 'Numbers' => Types::NumbersWidget,
                  'Traffic' => Types::TrafficWidget, 'Events' => Types::EventsWidget }
      raise "Unexpected WidgetType: #{obj.inspect}" unless widgets[obj.name]

      widgets[obj.name]
    end
  end
end

class Types::GuestsWidget < Types::BaseObject
  implements Types::WidgetType

  field "day_announcements", [Types::AnnouncementType] do
    description "MojoTech announcements today"
  end

  def day_announcements
    Announcement.happen_today(object.location.time_zone)
  end
end

class Types::WeatherWidget < Types::BaseObject
  implements Types::WidgetType

  field :weather, Types::WeatherType do
    description "Weather response from Dark Sky"
  end

  def weather
    object.location.weather
  end
end

class Types::TwitterWidget < Types::BaseObject
  implements Types::WidgetType

  field :tweets, [Types::TweetType] do
    description "Tweets from MojoTech"
  end

  def tweets
    Clients::TwitterClient.latest_tweets
  end
end

class Types::NumbersWidget < Types::BaseObject
  implements Types::WidgetType

  field :events, Types::EventCollectionType do
    description "MojoTech slack/github events"
    argument :after, String, required: false
    argument :type, Types::EventSourceType, required: false
  end

  def events(after: nil, type: nil)
    events = Event.all
    events = events.created_after(after) if after
    events = events.with_source(type) if type
    events
  end
end

class Types::EventsWidget < Types::BaseObject
  implements Types::WidgetType
end

class Types::TrafficWidget < Types::BaseObject
  implements Types::WidgetType

  field :traffic_cams, [Types::TrafficCamType]

  def traffic_cams
    object.location.traffic_cams
  end
end
