# Polls weather for subscribed locations
class WeatherPollerWorker
  include Sidekiq::Worker
  include Sidekiq::Repeat::Repeatable

  repeat { hourly.minute_of_hour(0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55) }

  def perform
    logger.info "Running weather poll"

    locations.each do |location|
      poll(location.latitude, location.longitude)
    end
  end

  def subscriptions
    $redis.pubsub("channels", "helios2_*:graphql-event::weatherPublished:*")
  end

  Location = Struct.new(:latitude, :longitude)

  PARSE_LOCATION = /latitude:(?<latitude>.+):longitude:(?<longitude>.+)$/

  def locations
    subscriptions.map do |subscription|
      captures = PARSE_LOCATION.match(subscription).named_captures
      Location.new(*captures.values)
    end.uniq
  end

  def poll(latitude, longitude)
    logger.info "Polling #{latitude} #{longitude}"

    data = Clients::DarkskyClient.forecast(latitude, longitude)
    Helios2Schema.subscriptions.trigger(
      "weatherPublished",
      { latitude: latitude.to_f, longitude: longitude.to_f },
      data
    )
  end
end
