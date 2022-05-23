class AddMissingUniqueIndices < ActiveRecord::Migration[5.2]
  def change
    add_index :locations, :city_name, unique: true

    add_index :widgets, [:location_id, :name], unique: true
    add_index :widgets, [:location_id, :position], unique: true
  end
end
