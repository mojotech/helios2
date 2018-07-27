class Types::QueryType < Types::BaseObject
  field :weather, Types::WeatherType do
    description "Weather response from Dark Sky"
    argument :latitude, Float, required: true
    argument :longitude, Float, required: true
  end

  def weather(latitude:, longitude:)
    Rails.cache.fetch('dark-sky-response', expires_in: 2.minutes) do
      ForecastIO.forecast(latitude, longitude)
    end
  end

  field :locations, [Types::LocationType] do
    description "MojoTech office locations"
  end

  def locations
    Rails.cache.fetch('locations-response', expires_in: 15.minutes) do
      Location.all
    end
  end

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

  field :primaryLocation, Types::LocationType do
    description "Location running the app"
  end

  def primary_location
    Rails.cache.fetch('primary-location-response', expires_in: 2.minutes) do
      Location.primary
    end
  end

  field :googleCal, Types::CalendarType do
    description "Google Calendar response"
    argument :calendarId, String, required: true
  end

  def google_cal
    Rails.cache.fetch('google-cal-response', expires_in: 2.minutes) do
      Clients::GoogleCal.new.get_events(args[:calendarId])
    end
  end
end
