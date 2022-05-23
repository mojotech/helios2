class CreateLocations < ActiveRecord::Migration[5.2]
  def change
    create_table :locations do |t|
      t.float :latitude, null: false
      t.float :longitude, null: false
      t.string :city_name, null: false
      t.string :time_zone, null: false

      t.timestamps
    end
  end
end
