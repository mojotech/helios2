require 'rails_helper'

RSpec.describe DailyEventSummary, type: :model do
  it "archives events into daily event summaries" do
    Event.delete_all
    DailyEventSummary.delete_all
    Event.create!(source: 'github_pull', external_id: '1000')
    Event.create!(source: 'github_pull', external_id: '1001')
    Event.create!(source: 'github_pull', external_id: '1002')
    Event.create!(source: 'github_commit', external_id: '100')

    DailyEventSummary.archive!(Event.all)

    expect(DailyEventSummary.count).to eq(2)
    expect(Event.count).to eq(0)

    pull = DailyEventSummary.where(source: 'github_pull').first
    expect(pull).not_to be_nil
    expect(pull.count).to eq(3)

    commit = DailyEventSummary.where(source: 'github_commit').first
    expect(commit).not_to be_nil
    expect(commit.count).to eq(1)
  end
end
