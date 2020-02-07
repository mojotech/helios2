class CreateTrafficCams < ActiveRecord::Migration[5.2]
  def change
    create_table :traffic_cams do |t|
      t.string :title, null: false
      t.string :url, null: false
      t.references :location
      t.timestamps
    end
  end
end
