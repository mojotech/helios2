class Location < ApplicationRecord
  validates :latitude, presence: true
  validates :longitude, presence: true
  validates :city_name, presence: true, uniqueness: true
  validates :time_zone, presence: true
end
