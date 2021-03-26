require 'rails_helper'

module WeatherHelpers
  def self.weather_response
    JSON.parse(File.read(Rails.root.join("spec", "fixtures", "files", "onecall_response_1.json")))
  end
end

RSpec.describe Solarcycle, type: :model do
  before do
    Location.delete_all
    @providence = Location.create!(
      latitude: 40.7127,
      longitude: -74.0059,
      city_name: 'Providence',
      time_zone: 'America/New_York'
    )
    allow(Clients::WeatherClient).to receive(:get) { WeatherHelpers.weather_response }

    Timecop.freeze(Time.new(2019, 6, 16, 6, 0, 0, ActiveSupport::TimeZone['America/New_York'].formatted_offset))
  end

  after do
    Timecop.return
  end

  it "should have a weather response" do
    weather = Location.first.weather
    expect(weather).to_not be_nil
    expect(weather['solarcycles']).to be_a(Array)
  end

  it "should show time now in New_York timezone" do
    expect(@providence.time_now).to eq(
      Time.new(2019, 6, 16, 6, 0, 0, ActiveSupport::TimeZone['America/New_York'].formatted_offset)
    )
  end
end
