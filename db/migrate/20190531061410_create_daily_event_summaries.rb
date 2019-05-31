class CreateDailyEventSummaries < ActiveRecord::Migration[5.2]
  def change
    create_table :daily_event_summaries do |t|
      t.string :source, null: false
      t.date :day, null: false
      t.integer :count, null: false
      t.timestamps
    end
  end
end
