require 'rails_helper'

module WeatherHelpers
  def self.weather_response
    JSON.parse(File.read(Rails.root.join("spec/fixtures/files/onecall_response_1.json")))
  end
end

describe Helios2Schema do
  let(:context) { {} }
  let(:variables) { {} }

  before {
    Location.delete_all
    Location.create!(
      latitude: 40.7127,
      longitude: -74.0059,
      city_name: 'Providence',
      time_zone: 'America/New_York'
    )
    allow(Clients::WeatherClient).to receive(:get) { WeatherHelpers.weather_response }
    allow(ENV).to receive(:[]).with('PRIMARY_CITY_NAME') { 'Providence' }
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
    let(:query_string) {
      %(
{
  location(cityName: "Providence"){
    weather{
      current{
        weather{
          main
        }
      }
    }
  }
}
      )
    }

    context "from anonymous" do
      it "will consume an OpenWeather response and return data" do
        expect(result["data"]["location"]["weather"]["current"]["weather"]["main"]).to eq("Mist")
      end
    end
  end
end
