class AddWifiPasswordToLocations < ActiveRecord::Migration[5.2]
  def change
    add_column :locations, :wifi_password, :string
  end
end
