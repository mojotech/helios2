class DropSolarCycles < ActiveRecord::Migration[5.2]
  def up
    drop_table(:solarcycles)
  end

  def down
    create_table :solarcycles do |t|
      t.string "type", null: false
      t.string "time", null: false
      t.integer "location_id"
      t.index ["location_id"], name: "index_solarcycles_on_location_id"
      t.timestamps
    end
  end
end
