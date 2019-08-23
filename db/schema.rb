# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_08_23_182602) do

  create_table "announcements", force: :cascade do |t|
    t.datetime "publish_on", null: false
    t.string "message"
    t.string "people", null: false
    t.string "company"
    t.string "announcement_id", null: false
    t.string "location_id"
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
  end

  create_table "solarcycles", force: :cascade do |t|
    t.string "type", null: false
    t.string "time", null: false
    t.integer "location_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["location_id"], name: "index_solarcycles_on_location_id"
  end

  create_table "traffic_cams", force: :cascade do |t|
    t.string "title", null: false
    t.string "url", null: false
    t.integer "location_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["location_id"], name: "index_traffic_cams_on_location_id"
  end

  create_table "widgets", force: :cascade do |t|
    t.string "name", null: false
    t.boolean "enabled", null: false
    t.integer "duration_seconds", null: false
    t.integer "position", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
