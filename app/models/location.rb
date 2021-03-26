class Location < ApplicationRecord
  validates :latitude, presence: true
  validates :longitude, presence: true
  validates :city_name, presence: true, uniqueness: true
  validates :time_zone, presence: true

  has_many :announcements, inverse_of: :location, dependent: :destroy
  has_many :solarcycles, dependent: :destroy
  has_many :traffic_cams, dependent: :destroy
  has_many :widgets, dependent: :destroy

  def self.primary(city_name = ENV['PRIMARY_CITY_NAME'])
    find_by(city_name: city_name)
  end

  def weather
    response = ::Clients::DarkskyClient.forecast(self).dup
    response['solarcycles'] = solarcycles.after_beginning_of_yesterday.to_a
    response['moonPhase'] = moon_phase
    response.freeze
    response
  end

  MOON_CYCLE_TIME = 2_551_442.8
  FIRST_NEW_MOON_EPOCH = 592_500

  def moon_phase
    phase_ratio = ((Time.now.to_i - FIRST_NEW_MOON_EPOCH) % MOON_CYCLE_TIME) / MOON_CYCLE_TIME
    (phase_ratio * 8).round * 0.125
  end

  def day_announcements
    announcements.happen_today(time_zone)
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

  def time_now
    Time.now.in_time_zone(time_zone)
  end
end
