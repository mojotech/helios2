class Types::QueryType < Types::BaseObject
  field :locations, [Types::LocationType] do
    description "MojoTech office locations"
  end

  field :location, [Types::LocationType] do
    description "Target location to receive updates"
    argument :city_name, String, "City name of location", required: true
  end

  def locations
    Rails.cache.fetch('locations-response', expires_in: 15.minutes) do
      Location.all
    end
  end

  def location(city_name)
    Rails.cache.fetch('location-response', expires_in: 15.minutes) do
      Location.where(city_name: city_name[:city_name])
    end
  end

  field :tweets, [Types::TweetType] do
    description "Tweets from MojoTech"
  end

  def tweets
    Clients::TwitterClient.latest_tweets
  end

  field :events, Types::EventCollectionType do
    description "MojoTech slack/github events"
    argument :after, String, required: false
    argument :type, Types::EventSourceType, required: false
  end

  def events(after: nil, type: nil)
    events = Event.all
    events = events.created_after(Date.parse(after)) if after
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
end
