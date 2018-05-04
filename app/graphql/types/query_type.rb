Types::QueryType = GraphQL::ObjectType.define do
  name "Query"

  field :weather, Types::WeatherType do
    description "Weather response from Dark Sky"
    argument :latitude, !types.Float
    argument :longitude, !types.Float
    resolve ->(obj, args, ctx) {
      ForecastIO.forecast(args[:latitude], args[:longitude])
    }
  end
end
