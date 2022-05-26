class Types::QueryType < Types::BaseObject
  field :location, Types::LocationType do
    description "Target location to receive updates"
    argument :city_name, String, "City name of location", required: true
  end

  def location(options = {})
    city_name = options[:city_name]
    Location.where(city_name: city_name).first
  end

  field :tweets, [Types::TweetType] do
    description "Tweets from MojoTech"
  end

  def tweets
    Clients::TwitterClient.latest_tweets
  end

  field :events, Types::EventCollectionType do
    description "MojoTech slack/github events"
    argument :created_after, String, required: false
    argument :type, Types::EventSourceType, required: false
  end

  def events(created_after: nil, type: nil)
    events = Event.all
    events = events.created_after(Date.parse(created_after)) if created_after
    events = events.with_source(type) if type
    events
  end

  field :employee_events, Types::EmployeeEventCollectionType do
    description "Employee events from bambooHR"
  end

  def employee_events
    # dummy return value for now because cannot return null
    # will be filled in with database calls in a later PR
    42
  end
end
