class CreateWidgets < ActiveRecord::Migration[5.2]
  def change
    create_table :widgets do |t|
      t.string :name, null: false
      t.boolean :enabled, null: false
      t.integer :duration_seconds, null: false
      t.integer :position, null: false

      t.timestamps
    end
  end
end
