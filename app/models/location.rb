class Location < ApplicationRecord
  validates :latitude, presence: true
  validates :longitude, presence: true
  validates :city_name, presence: true, uniqueness: true
  validates :time_zone, presence: true

  def self.primary
    find_by(city_name: ENV['PRIMARY_CITY_NAME'])
  end
end
