class ChangeLocationIdTypeFromAnnouncements < ActiveRecord::Migration[6.0]
  def up
    if ActiveRecord::Base.connection.adapter_name == "PostgreSQL"
      change_column :announcements, :location_id, :integer, using: 'location_id::integer'
    else
      change_column :announcements, :location_id, :integer
    end
  end

  def down
    change_column :announcements, :location_id, :string
  end
end
