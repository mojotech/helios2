class Clients::DarkskyClient
  def self.forecast(location)
    key = "darksky-response-#{location.latitude}-#{location.longitude}"
    Rails.cache.fetch(key, expires_in: 5.minutes) do
      forecast = ForecastIO.forecast(location.latitude, location.longitude)
      forecast['daily']['data'].each do |dailyrecord|
        fetch_solar_cycle_data(dailyrecord, location.time_zone, location.id)
      end
      forecast
    end
  end

  def self.fetch_solar_cycle_data(dailyrecord, time_zone, id)
    Time.use_zone(time_zone) {
      solar_cycle_check('sunrise', Time.at(dailyrecord['sunriseTime']).iso8601, id)
      solar_cycle_check('sunset', Time.at(dailyrecord['sunsetTime']).iso8601, id)
    }
  end

  def self.solar_cycle_check(type, time, location_id)
    scope = Solarcycle.where(type: type, time: time, location_id: location_id)

    solarcycle = scope.first_or_initialize
    return unless solarcycle.new_record?

    solarcycle.save!
  end
end
