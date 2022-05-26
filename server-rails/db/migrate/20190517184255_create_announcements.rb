class CreateAnnouncements < ActiveRecord::Migration[5.2]
  def change
    create_table :announcements do |t|
      t.datetime :publish_on, null: false
      t.string :message
      t.string :people, null: false
      t.string :company
      t.string :announcement_id, null: false, unique: true
      t.references :location, type: :string
      t.timestamps
    end
  end
end
