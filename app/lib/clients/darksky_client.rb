class Clients::DarkskyClient
  def self.forecast(latitude, longitude)
    key = "darksky-response-#{latitude}-#{longitude}"

    Rails.cache.fetch(key, expires_in: 5.minutes) do
      ForecastIO.forecast(latitude, longitude)
    end
  end
end
