class Widget < ApplicationRecord
  attribute :start, :time_only
  attribute :stop, :time_only

  validates :name, presence: true, uniqueness: { scope: :location_id }
  validates :position, presence: true, uniqueness: { scope: :location_id }

  belongs_to :location

  default_scope { order(position: :asc) }
  scope :enabled, -> { where(enabled: true) }
  scope :available, ->(time) do
    tod = if Tod::TimeOfDay.parsable?(time)
            Tod::TimeOfDay.parse(time).to_s
          else
            Tod::TimeOfDay(time)
          end
    where('(start <= ? OR start IS NULL) AND (stop >= ? OR stop IS NULL)', tod, tod)
  end

  def self.next_or_default(current_id)
    current_id && where('id > ?', current_id).order(:position).first || first
  end
end
