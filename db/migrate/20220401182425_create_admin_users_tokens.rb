class CreateAdminUsersTokens < ActiveRecord::Migration[6.1]
  def change
    create_table :admin_users_tokens do |t|
      t.references :admin_users, index: true, foreign_key: { on_delete: :cascade }
      t.binary :token, null: false
      t.string :context, null: false
      t.string :sent_to
      t.datetime :created_at, null: false
    end

    add_index :admin_users_tokens, [:admin_user_id]
    add_index :admin_users_tokens, [:context, :token], unique: true
  end
end
