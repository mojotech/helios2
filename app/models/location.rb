class Location < ApplicationRecord
  validates :latitude, presence: true
  validates :longitude, presence: true
  validates :city_name, presence: true, uniqueness: true
  validates :time_zone, presence: true

  has_many :announcements, inverse_of: :location, dependent: :destroy
  has_many :traffic_cams, dependent: :destroy
  has_many :widgets, dependent: :destroy

  def self.primary(city_name = ENV['PRIMARY_CITY_NAME'])
    find_by(city_name: city_name)
  end

  def weather
    response = ::Clients::WeatherClient.forecast(self).dup
    response.freeze
    response
  end

  # rubocop:disable Metrics/AbcSize
  def solar_cycles(now = Time.zone.now)
    yesterday_sunset = Sun.sunset(now - 1.day, latitude, longitude).utc.iso8601
    today_sunrise = Sun.sunrise(now, latitude, longitude).utc.iso8601
    today_sunset = Sun.sunset(now, latitude, longitude).utc.iso8601
    tomorrow_sunrise = Sun.sunrise(now + 1.day, latitude, longitude).utc.iso8601

    [{
      time: yesterday_sunset,
      type: 'sunset'
    }, {
      time: today_sunrise,
      type: 'sunrise'
    }, {
      time: today_sunset,
      type: 'sunset'
    }, {
      time: tomorrow_sunrise,
      type: 'sunrise'
    }]
  end
  # rubocop:enable Metrics/AbcSize

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

  def time_now
    Time.now.in_time_zone(time_zone)
  end

  def display_name
    city_name
  end
end
