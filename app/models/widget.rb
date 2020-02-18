class Widget < ApplicationRecord
  serialize :start, Tod::TimeOfDay
  serialize :stop, Tod::TimeOfDay

  validates :name, presence: true, uniqueness: true
  validates :position, presence: true, uniqueness: true

  belongs_to :location

  default_scope { order(position: :asc) }
  scope :enabled, -> { where(enabled: true) }
  scope :available, ->(time) do
    tod = Tod::TimeOfDay(time).to_s
    where('(start <= ? OR start IS NULL) AND (stop >= ? OR stop IS NULL)', tod, tod)
  end

  def self.next_or_default(current_id)
    current_id && where('id > ?', current_id).order(:position).first || first
  end
end
