class Announcement < ApplicationRecord
  validates :publish_on, presence: true
  validates :people, presence: true
  validates :announcement_id, presence: true

  belongs_to :location, inverse_of: :announcements

  scope :with_location, ->(location) { where(location: location) }
  scope :happen_today, ->(time_zone) do
    today = Time.now.in_time_zone(time_zone)
    tomorrow = today + 24.hours
    where(publish_on: today..tomorrow)
  end
end
