class Widget < ApplicationRecord
  validates :name, presence: true, uniqueness: true
  validates :position, presence: true, uniqueness: true
end
