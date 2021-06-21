class Types::QueryType < Types::BaseObject
  field :location, Types::LocationType do
    description "Target location to receive updates"
    argument :city_name, String, "City name of location", required: true
  end

  def location(options = {})
    city_name = options[:city_name]
    Rails.cache.fetch("location-response-#{city_name}", expires_in: 15.minutes) do
      Location.where(city_name: city_name).first
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
end
