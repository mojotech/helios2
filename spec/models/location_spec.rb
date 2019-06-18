require 'rails_helper'

module WeatherHelpers
  def self.darksky_response
    text = File.read(Rails.root.join("spec", "fixtures", "files", "darksky_response_1.json"))
    json = JSON.parse(text)
    Hashie::Mash.new(json)
  end
end

RSpec.describe Solarcycle, type: :model do
  before do
    Location.delete_all
    Location.create!(
      latitude: 40.7127,
      longitude: -74.0059,
      city_name: 'Providence',
      time_zone: 'America/New_York'
    )
    allow(ForecastIO).to receive(:forecast) { WeatherHelpers.darksky_response }
  end

  after do
    Timecop.return
  end

  it "should have a weather response" do
    weather = Location.first.weather
    expect(weather).to_not be_nil
  end
end
