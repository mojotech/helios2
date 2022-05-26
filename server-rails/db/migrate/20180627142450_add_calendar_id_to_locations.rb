class AddCalendarIdToLocations < ActiveRecord::Migration[5.2]
  def change
    add_column :locations, :calendar_id, :string, null: true
  end
end
