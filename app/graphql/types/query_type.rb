Types::QueryType = GraphQL::ObjectType.define do
  name "Query"

  field :weather, Types::WeatherType do
    description "Weather response from Dark Sky"
    argument :latitude, !types.Float
    argument :longitude, !types.Float
    resolve ->(_obj, args, _ctx) {
      Rails.cache.fetch('dark-sky-response', expires_in: 2.minutes) do
        ForecastIO.forecast(args[:latitude], args[:longitude])
      end
    }
  end

  field :locations, !types[Types::LocationType] do
    description "MojoTech office locations"
    resolve ->(_, _, _) {
      Rails.cache.fetch('locations-response', expires_in: 15.minutes) do
        Location.all
      end
    }
  end

  field :primaryLocation, Types::LocationType do
    description "Location running the app"
    resolve ->(_, _, _) { Location.primary }
  end
end
