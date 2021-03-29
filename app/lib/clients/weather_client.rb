class Clients::WeatherClient
  WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/onecall?lat=%{lat}&lon=%{lon}&appid=%{key}'.freeze

  def self.forecast(location)
    key = "openweather-response-#{location.latitude}-#{location.longitude}"
    Rails.cache.fetch(key, expires_in: 5.minutes) do
      forecast = get(location.latitude, location.longitude)
      forecast['daily'].each do |dailyrecord|
        fetch_solar_cycle_data(dailyrecord, location.time_zone, location.id)
      end
      forecast
    end
  end

  def self.fetch_solar_cycle_data(dailyrecord, time_zone, id)
    Time.use_zone(time_zone) {
      solar_cycle_check('sunrise', Time.at(dailyrecord['sunrise']).iso8601, id)
      solar_cycle_check('sunset', Time.at(dailyrecord['sunset']).iso8601, id)
    }
  end

  def self.solar_cycle_check(type, time, location_id)
    scope = Solarcycle.where(type: type, time: time, location_id: location_id)

    solarcycle = scope.first_or_initialize
    return unless solarcycle.new_record?

    solarcycle.save!
  end

  def self.configure
    yield self
  end

  def self.get(latitude, longitude)
    response = Faraday.get(WEATHER_API_URL % { lat: latitude, lon: longitude, key: ENV['WEATHER_API_KEY'] })
    return JSON.parse(response.body) if response.success?
  end
end
