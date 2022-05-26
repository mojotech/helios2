class DeveloperUser < ApplicationRecord
  validates :public_key, presence: true
  validates :git_handle, presence: true
  validates :slack_handle, presence: true
end
