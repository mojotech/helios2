class Types::SubscriptionType < Types::BaseObject
  field :event_published, Types::EventType, description: "An event was published to the API"

  def event_published; end

  field :weather_published, Types::WeatherType do
    description "Latest weather data retrieved"
    argument :latitude, Float, required: true
    argument :longitude, Float, required: true
  end

  def weather_published(latitude:, longitude:); end

  field :announcement_published, Types::AnnouncementType, description: "An announcement was published"

  def announcement_published; end

  field :schema_sha, String, description: "Updated SHA value"

  def schema_sha; end
end
