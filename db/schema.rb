# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2022_04_01_182425) do

  create_table "active_admin_comments", force: :cascade do |t|
    t.string "namespace"
    t.text "body"
    t.string "resource_type"
    t.integer "resource_id"
    t.string "author_type"
    t.integer "author_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["author_type", "author_id"], name: "index_active_admin_comments_on_author"
    t.index ["namespace"], name: "index_active_admin_comments_on_namespace"
    t.index ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource"
  end

  create_table "admin_users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_admin_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_admin_users_on_reset_password_token", unique: true
  end

  create_table "admin_users_tokens", force: :cascade do |t|
    t.integer "admin_users_id"
    t.binary "token", null: false
    t.string "context", null: false
    t.string "sent_to"
    t.datetime "created_at", null: false
    t.index "\"admin_user_id\"", name: "index_admin_users_tokens_on_admin_user_id"
    t.index ["admin_users_id"], name: "index_admin_users_tokens_on_admin_users_id"
    t.index ["context", "token"], name: "index_admin_users_tokens_on_context_and_token", unique: true
  end

  create_table "announcements", force: :cascade do |t|
    t.datetime "publish_on", null: false
    t.string "message"
    t.string "people", null: false
    t.string "company"
    t.string "announcement_id", null: false
    t.integer "location_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["location_id"], name: "index_announcements_on_location_id"
  end

  create_table "daily_event_summaries", force: :cascade do |t|
    t.string "source", null: false
    t.date "day", null: false
    t.integer "count", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "developer_users", force: :cascade do |t|
    t.text "public_key", null: false
    t.string "git_handle", null: false
    t.string "slack_handle", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "events", force: :cascade do |t|
    t.string "source"
    t.string "external_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["source", "external_id"], name: "index_events_on_source_and_external_id", unique: true
  end

  create_table "locations", force: :cascade do |t|
    t.float "latitude", null: false
    t.float "longitude", null: false
    t.string "city_name", null: false
    t.string "time_zone", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "wifi_name"
    t.string "wifi_password"
    t.string "bathroom_code"
    t.index ["city_name"], name: "index_locations_on_city_name", unique: true
  end

  create_table "traffic_cams", force: :cascade do |t|
    t.string "title", null: false
    t.string "url", null: false
    t.integer "location_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "feed_format", default: "image", null: false
    t.index ["location_id"], name: "index_traffic_cams_on_location_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "user_name", null: false
    t.text "public_key", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "widgets", force: :cascade do |t|
    t.string "name", null: false
    t.boolean "enabled", null: false
    t.integer "duration_seconds", null: false
    t.integer "position", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "location_id"
    t.string "start"
    t.string "stop"
    t.string "sidebar_text"
    t.boolean "show_weather"
    t.index ["location_id", "name"], name: "index_widgets_on_location_id_and_name", unique: true
    t.index ["location_id", "position"], name: "index_widgets_on_location_id_and_position", unique: true
    t.index ["location_id"], name: "index_widgets_on_location_id"
  end

  add_foreign_key "admin_users_tokens", "admin_users", column: "admin_users_id", on_delete: :cascade
end
