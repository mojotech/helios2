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
  field "weather", Types::WeatherType
end
