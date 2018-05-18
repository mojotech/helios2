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
    resolve ->(obj, _, _) { obj.id == Location.primary.try(:id) }
  end
  field "weather", Types::WeatherType do
    resolve ->(obj, _, _) { ForecastIO.forecast(obj.latitude, obj.longitude) }
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