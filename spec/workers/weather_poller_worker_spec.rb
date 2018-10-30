require 'rails_helper'
RSpec.describe WeatherPollerWorker, type: :worker do
  before {
    allow(ForecastIO).to receive(:forecast) { "" }
    allow_any_instance_of(Redis).to(
      receive(:pubsub) {
        ["helios2_development:graphql-event::weatherPublished:latitude:41.823979:longitude:-71.412834"]
      }
    )
  }

  describe "a poller" do
    it "will query uniq locations from redis " do
      expect(WeatherPollerWorker.new.locations).to(
        eq([WeatherPollerWorker::Location.new("41.823979", "-71.412834")])
      )
    end

    it "will publish the darksky response when polling a location" do
      expect(Helios2Schema.subscriptions).to(
        receive(:trigger).with(
          "weatherPublished",
          { latitude: 41.823979, longitude: -71.412834 },
          ""
        )
      )
      WeatherPollerWorker.new.poll("41.823979", "-71.412834")
    end

    it "will perform a poll for every location" do
      worker = WeatherPollerWorker.new
      expect(worker).to(
        receive(:poll).with("41.823979", "-71.412834")
      )
      worker.perform
    end
  end
end
