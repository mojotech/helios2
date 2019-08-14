class Types::LocationType < Types::BaseObject
  graphql_name "Location"

  field "id", ID
  field "latitude", Float
  field "longitude", Float
  field "timezone", String, method: :time_zone
  field "city_name", String
  field "is_primary", Boolean, method: :primary?
  field "weather", Types::WeatherType
  field "day_announcements", [Types::AnnouncementType]
  field "wifi_name", String
  field "wifi_password", String
  field "bathroom_code", String
  field "livestream_url", String
end
