class Event < ApplicationRecord
  enum source: {
    github_commit: 'github_commit',
    github_pull: 'github_pull',
    slack_message: 'slack_message'
  }


  scope :pull_requests, -> { where(source: :github_pull) }
  scope :commits, -> { where(source: :github_commit) }

  scope :with_external_id, ->(external_id) { where(external_id: external_id) }
end
