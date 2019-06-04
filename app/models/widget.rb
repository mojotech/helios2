class Widget < ApplicationRecord
  validates :name, presence: true, uniqueness: true
  validates :position, presence: true, uniqueness: true

  default_scope { order(position: :asc) }
  scope :enabled, -> { where(enabled: true) }
end
