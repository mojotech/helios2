class Solarcycle < ApplicationRecord
  self.inheritance_column = :_type_disabled
  belongs_to :location

  scope :after_beginning_of_yesterday, -> { where('time > ?', 1.day.ago.beginning_of_day) }
end
