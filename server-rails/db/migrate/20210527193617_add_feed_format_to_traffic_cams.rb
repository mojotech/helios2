class AddFeedFormatToTrafficCams < ActiveRecord::Migration[5.2]
  def change
    add_column :traffic_cams, :feed_format, :string, null: false, default: 'image'
  end
end
