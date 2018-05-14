Types::QueryType = GraphQL::ObjectType.define do
  name "Query"

  field :weather, Types::WeatherType do
    description "Weather response from Dark Sky"
    resolve ->(_, _, _) {
      Rails.cache.fetch('dark-sky-response', expires_in: 2.minutes) do
        primary_location = Location.primary
        ForecastIO.forecast(primary_location.latitude, primary_location.longitude)
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
end
