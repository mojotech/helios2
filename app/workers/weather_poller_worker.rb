# Polls weather for subscribed locations
class WeatherPollerWorker
  include Sidekiq::Worker
  include Sidekiq::Repeat::Repeatable

  repeat { hourly.minute_of_hour(0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55) }

  def perform
    logger.info "Running weather poll"

    locations.each do |location|
      poll(location)
    end
  end

  def subscriptions
    $redis.pubsub("channels", "helios2_*:graphql-event::weatherPublished:*")
  end

  LocationParams = Struct.new(:latitude, :longitude)

  PARSE_LOCATION = /latitude:(?<latitude>.+):longitude:(?<longitude>.+)$/

  def locations
    subscriptions.map do |subscription|
      captures = PARSE_LOCATION.match(subscription).named_captures
      LocationParams.new(*captures.values)
    end.uniq
  end

  def poll(location)
    logger.info "Polling #{location.latitude} #{location.longitude}"
    location_record = Location.where(latitude: location.latitude, longitude: location.longitude).first
    get_forecast(location_record, location)
  end

  def get_forecast(record, location)
    data = Clients::DarkskyClient.forecast(record)
    Helios2Schema.subscriptions.trigger(
      "weatherPublished",
      { latitude: location.latitude.to_f, longitude: location.longitude.to_f },
      data
    )
  end
end
