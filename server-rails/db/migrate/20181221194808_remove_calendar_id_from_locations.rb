class RemoveCalendarIdFromLocations < ActiveRecord::Migration[5.2]
  def change
    remove_column :locations, :calendar_id, :string
  end
end
