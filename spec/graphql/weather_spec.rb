require 'rails_helper'

module WeatherHelpers
  def self.darksky_response
    text = File.read(Rails.root.join("spec/fixtures/files/darksky_response_1.json"))
    json = JSON.parse(text)
    Hashie::Mash.new(json)
  end
end

describe Helios2Schema do
  let(:context) { {} }
  let(:variables) { {} }

  before {
    allow(ForecastIO).to receive(:forecast) { WeatherHelpers.darksky_response }
  }

  let(:result) {
    res = Helios2Schema.execute(
      query_string,
      context: context,
      variables: variables
    )
    raise res["errors"].to_s if res["errors"]
    res
  }

  describe "a weather query" do
    # provide a query string for `result`
    let(:query_string) { %|
      {
	weather(latitude: 40.7127, longitude: -74.0059) {
	  currently {
	    summary
	    temperature
	    time
	  }
	}
      }
    | }

    context "from anonymous" do
      it "will consume a DarkSky response and return data" do 
        expect(result["data"]["weather"]["currently"]["summary"]).to eq("Partly Cloudy")
      end
    end
  end
end
