class Clients::WeatherClient
  WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/onecall?lat=%{lat}&lon=%{lon}&appid=%{key}'.freeze

  def self.forecast(location)
    key = "openweather-response-#{location.latitude}-#{location.longitude}"
    Rails.cache.fetch(key, expires_in: 5.minutes) do
      get(location.latitude, location.longitude)
    end
  end

  def self.configure
    yield self
  end

  def self.get(latitude, longitude)
    response = Faraday.get(WEATHER_API_URL % { lat: latitude, lon: longitude, key: ENV['WEATHER_API_KEY'] })
    return JSON.parse(response.body) if response.success?
  end
end
