class CreateEvents < ActiveRecord::Migration[5.2]
  def change
    create_table :events do |t|
      t.string :source
      t.string :external_id

      t.timestamps
    end

    add_index :events, [:source, :external_id], unique: true
  end
end
