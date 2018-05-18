class AddBathroomCodeToLocations < ActiveRecord::Migration[5.2]
  def change
    add_column :locations, :bathroom_code, :string
  end
end
