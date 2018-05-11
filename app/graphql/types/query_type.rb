Types::QueryType = GraphQL::ObjectType.define do
  name "Query"

  field :weather, Types::WeatherType do
    description "Weather response from Dark Sky"
    argument :latitude, !types.Float
    argument :longitude, !types.Float
    resolve ->(obj, args, ctx) {
      Rails.cache.fetch('dark-sky-response', expires_in: 2.minutes) do
        ForecastIO.forecast(args[:latitude], args[:longitude])
      end
    }
  end
end
