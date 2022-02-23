class Types::LocationType < Types::BaseObject
  graphql_name "Location"

  field "id", ID
  field "latitude", Float
  field "longitude", Float
  field "time_zone", String
  field "city_name", String
  field "is_primary", Boolean, method: :primary?
  field "weather", Types::WeatherType
  field "day_announcements", [Types::AnnouncementType]
  field "widgets", Types::WidgetCollectionType
  field "moon_phase", Float
  field "solar_cycles", [Types::SolarcycleType]

  field "wifi_name", String, null: true
  field "wifi_password", String, null: true
  field "bathroom_code", String, null: true
  field "traffic_cams", [Types::TrafficCamType]
end
