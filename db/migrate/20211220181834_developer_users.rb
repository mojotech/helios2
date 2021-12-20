class DeveloperUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :developer_users do |t|
      t.text :public_key, null: false
      t.string :git_handle, null: false
      t.string :slack_handle, null: false

      t.timestamps
    end
  end
end
