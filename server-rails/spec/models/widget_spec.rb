require 'rails_helper'

RSpec.describe Widget, type: :model do
  Location.delete_all
  loc = Location.create(
    latitude: 41.823989,
    longitude: -71.412834,
    city_name: 'Providence',
    time_zone: 'America/New_York'
  )

  Widget.delete_all
  guests = Widget.create(
    name: "Guests",
    enabled: false,
    duration_seconds: 20,
    position: 0,
    location_id: loc.id
  )

  weather = Widget.create(
    name: "Weather",
    enabled: true,
    duration_seconds: 20,
    position: 1,
    location_id: loc.id
  )

  twitter = Widget.create(
    name: "Twitter",
    enabled: false,
    duration_seconds: 20,
    position: 2,
    location_id: loc.id
  )

  numbers = Widget.create(
    name: "Numbers",
    enabled: true,
    duration_seconds: 20,
    position: 3,
    location_id: loc.id
  )

  it "returns next widget" do
    expect(Widget.next_or_default(weather[:id])).to eq(twitter)
    expect(Widget.next_or_default(numbers[:id])).to eq(guests)
    expect(Widget.next_or_default(guests[:id])).to eq(weather)

    expect(Widget.next_or_default(twitter[:id])).to eq(numbers)
    expect(Widget.next_or_default(nil)).to eq(guests)
  end

  it "returns next enabled widget" do
    expect(Widget.enabled.next_or_default(weather[:id])).to eq(numbers)
    expect(Widget.enabled.next_or_default(numbers[:id])).to eq(weather)
    expect(Widget.enabled.next_or_default(guests[:id])).to eq(weather)

    expect(Widget.enabled.next_or_default(twitter[:id])).to eq(numbers)
    expect(Widget.enabled.next_or_default(nil)).to eq(weather)
  end

  it "returns array of enabled widgets" do
    enabled_widgets = [weather, numbers]
    expect(Widget.enabled).to eq(enabled_widgets)
  end

  context ".available" do
    it "parses a time of day" do
      expect(Widget.available("22:00")).to eq([guests, weather, twitter, numbers])
    end

    # frontend param is being parsed as a ActiveSupport DateTime so pass instead of parse
    it "handles ActiveSupport DateTime" do
      expect(Widget.available(DateTime.parse("2022-02-22 13:55:11 -0500"))).to eq([guests, weather, twitter, numbers])
    end
  end
end
