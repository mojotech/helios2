Types::LocationType = GraphQL::ObjectType.define do
  name "Location"

  field "id", !types.ID
  field "latitude", !types.Float
  field "longitude", !types.Float
  field "timezone", !types.String do
    resolve ->(obj, _, _) { obj.time_zone }
  end
  field "cityName", !types.String do
    resolve ->(obj, _, _) { obj.city_name }
  end
  field "isPrimary", !types.Boolean do
    resolve ->(obj, _, _) { obj.primary? }
  end
  field "weather", Types::WeatherType
  field "googleCal", Types::CalendarType do
    resolve ->(obj, _, _) { obj.google_cal }
  end
  field "wifiName", types.String do
    resolve ->(obj, _, _) { obj.wifi_name }
  end
  field "wifiPassword", types.String do
    resolve ->(obj, _, _) { obj.wifi_password }
  end
  field "bathroomCode", types.String do
    resolve ->(obj, _, _) { obj.bathroom_code }
  end
end
