class Event < ApplicationRecord
  enum source: {
    github_commit: 'github_commit',
    github_pull: 'github_pull',
    slack_message: 'slack_message'
  }

  validates :external_id, uniqueness: { scope: :source, message: "must be unique" }

  scope :with_source, ->(source) { where(source: source) }
  scope :created_after, ->(after) { where('created_at > ?', after) }

  scope :pull_requests, -> { where(source: :github_pull) }
  scope :commits, -> { where(source: :github_commit) }
  scope :slack_messages, -> { where(source: :slack_message) }

  scope :with_external_id, ->(external_id) { where(external_id: external_id) }

  scope :before_beginning_of_week, -> { where('created_at < ?', Time.zone.today.beginning_of_week) }
end
