require 'rails_helper'

RSpec.describe ShaPollerWorker, type: :worker do
  before {
    allow(AppEnv).to receive(:[]).with('HEROKU_SLUG_COMMIT') { nil }
  }

  describe "SHA Poll Worker" do
    context "should publish the deployed SHA value" do
      it "will publish deployed SHA when triggered" do
        expect(Helios2Schema.subscriptions).to(
          receive(:trigger).with(
            "deploymentSha",
            {},
            "N/A"
          )
        )
        ShaPollerWorker.new.perform
      end
    end
  end
end
