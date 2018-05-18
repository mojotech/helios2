class AddWifiNameToLocations < ActiveRecord::Migration[5.2]
  def change
    add_column :locations, :wifi_name, :string
  end
end
