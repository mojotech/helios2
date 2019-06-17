require 'rails_helper'

TESTDATA =
  {
    "daily" => {
      "data" => [
        {
          "sunsetTime" => 1_559_625_180,
          "sunriseTime" => 1_559_679_420
        }
      ]
    }
  }.freeze

RSpec.describe WeatherPollerWorker, type: :worker do
  before {
    Location.delete_all
    Location.create!(
      latitude: 41.823989,
      longitude: -71.412834,
      city_name: 'Providence',
      time_zone: 'America/New_York'
    )
    allow(ForecastIO).to receive(:forecast) { TESTDATA }
    allow_any_instance_of(Redis).to(
      receive(:pubsub) {
        ["helios2_development:graphql-event::weatherPublished:latitude:41.823989:longitude:-71.412834"]
      }
    )
  }

  describe "a poller" do
    it "will query uniq locations from redis " do
      expect(WeatherPollerWorker.new.locations).to(
        eq([WeatherPollerWorker::LocationParams.new("41.823989", "-71.412834")])
      )
    end

    it "will publish the darksky response when polling a location" do
      expect(Helios2Schema.subscriptions).to(
        receive(:trigger).with(
          "weatherPublished",
          { latitude: 41.823989, longitude: -71.412834 },
          hash_including(TESTDATA)
        )
      )
      WeatherPollerWorker.new.poll(WeatherPollerWorker::LocationParams.new("41.823989", "-71.412834"))
    end

    it "will perform a poll for every location" do
      worker = WeatherPollerWorker.new
      expect(worker).to(
        receive(:poll).with(WeatherPollerWorker::LocationParams.new("41.823989", "-71.412834"))
      )
      worker.perform
    end
  end
end
