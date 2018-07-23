require 'rails_helper'

RSpec.describe Location, type: :model do
  context "without a calendar_id" do
    it "returns nil for google_cal" do
      location = Location.new
      expect(location.google_cal).to equal(nil)
    end
  end
end
