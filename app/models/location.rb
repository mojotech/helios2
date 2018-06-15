class Location < ApplicationRecord
  validates :latitude, presence: true
  validates :longitude, presence: true
  validates :city_name, presence: true, uniqueness: true
  validates :time_zone, presence: true

  def self.primary(city_name = ENV['PRIMARY_CITY_NAME'])
    find_by(city_name: city_name)
  end

  def weather
    @weather ||= ForecastIO.forecast(latitude, longitude)
  end

  def primary?
    city_name == ENV['PRIMARY_CITY_NAME']
  end

  def wifi_name
    ENV['WIFI_NAME']
  end

  def wifi_password
    ENV['WIFI_PASSWORD']
  end

  def bathroom_code
    ENV['BATHROOM_CODE']
  end
end
