class CreateWidgets < ActiveRecord::Migration[5.2]
  def change
    create_table :widgets do |t|
      t.string :text
      t.boolean :is_active, default: false

      t.timestamps
    end
  end
end
