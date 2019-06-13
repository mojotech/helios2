require 'rails_helper'

describe Helios2Schema do
  let(:context) { {} }

  before {
    Event.delete_all
    Event.create!(
      source: 'github_commit',
      external_id: '10000',
      created_at: Date.parse('2013-12-11T10:09:08.07')
    )
    Event.create!(
      source: 'github_pull',
      external_id: '10001',
      created_at: Date.parse('2013-12-11T10:09:08.07')
    )
    Event.create!(
      source: 'slack_message',
      external_id: '10002',
      created_at: Date.parse('2013-12-11T10:09:08.07')
    )

    Event.create!(
      source: 'github_commit',
      external_id: '10003',
      created_at: Date.parse('2000-12-11T10:09:08.07')
    )
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

  describe "an events query" do
    # provide a query string for `result`
    let(:query_string) {
      %|
query getEvents($after: String) {
  events(after: $after) {
    count {
      githubPull
      githubCommit
      slackMessage
    }
  }
}
      |
    }

    context "with no variables" do
      let(:variables) { {} }
      it "should query all event counts" do
        counts = result["data"]["events"]["count"]
        expect(counts["githubPull"]).to eq(1)
        expect(counts["githubCommit"]).to eq(2)
        expect(counts["slackMessage"]).to eq(1)
      end
    end

    context "with after variable in the past" do
      let(:variables) { { after: "Mon, 11 Jun 2012 04:00:00 GMT" } }
      it "should query event counts after date" do
        counts = result["data"]["events"]["count"]
        expect(counts["githubPull"]).to eq(1)
        expect(counts["githubCommit"]).to eq(1)
        expect(counts["slackMessage"]).to eq(1)
      end
    end

    context "with after variable in the future" do
      let(:variables) { { after: 10.days.from_now.iso8601 } }
      it "should no event counts after date" do
        counts = result["data"]["events"]["count"]
        expect(counts["githubPull"]).to eq(0)
        expect(counts["githubCommit"]).to eq(0)
        expect(counts["slackMessage"]).to eq(0)
      end
    end
  end
end
