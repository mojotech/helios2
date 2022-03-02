class ChangeLocationIdTypeFromAnnouncements < ActiveRecord::Migration[6.0]
  def up
    change_column :announcements, :location_id, :integer
  end

  def down
    change_column :announcements, :location_id, :string
  end
end
