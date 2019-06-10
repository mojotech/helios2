class Widget < ApplicationRecord
  validates :name, presence: true, uniqueness: true
  validates :position, presence: true, uniqueness: true

  belongs_to :location

  default_scope { order(position: :asc) }
  scope :enabled, -> { where(enabled: true) }

  def self.next_or_default(current_id)
    current_id && where('id > ?', current_id).order(:position).first || first
  end
end
