require 'rails_helper'

RSpec.describe Solarcycle, type: :model do
  before do
    Timecop.freeze(Time.new(2019, 6, 16, 6, 0, 0, "-04:00"))

    Location.delete_all
    Solarcycle.delete_all
    location = Location.create!(
      latitude: 40.7127,
      longitude: -74.0059,
      city_name: 'Providence',
      time_zone: 'America/New_York'
    )
    location.solarcycles.create!(
      type: 'sunrise',
      time: '2019-06-14T05:11:31-04:00'
    )
    location.solarcycles.create!(
      type: 'sunset',
      time: '2019-06-15T05:11:31-04:00'
    )
    location.solarcycles.create!(
      type: 'sunrise',
      time: '2019-06-16T05:11:31-04:00'
    )
  end

  after do
    Timecop.return
  end

  it "should limit cycles to after beginning of yesterday" do
    expect(Solarcycle.after_beginning_of_yesterday.count).to eq(2)
  end
end
