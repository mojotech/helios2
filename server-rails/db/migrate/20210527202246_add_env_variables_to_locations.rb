class AddEnvVariablesToLocations < ActiveRecord::Migration[5.2]
  def change
    add_column :locations, :wifi_name, :string
    add_column :locations, :wifi_password, :string
    add_column :locations, :bathroom_code, :string
  end
end
