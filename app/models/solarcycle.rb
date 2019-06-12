class Solarcycle < ApplicationRecord
  self.inheritance_column = :_type_disabled
  belongs_to :location
end
