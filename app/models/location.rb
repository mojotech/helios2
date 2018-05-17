class Location < ApplicationRecord
  validates :latitude, presence: true
  validates :longitude, presence: true
  validates :city_name, presence: true, uniqueness: true
  validates :time_zone, presence: true

  def self.primary(city_name = ENV['PRIMARY_CITY_NAME'])
    find_by(city_name: city_name)
  end

  def weather
    ForecastIO.forecast(latitude, longitude)
  end
end
