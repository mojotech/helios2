Types::UnixDateTimeType = GraphQL::ScalarType.define do
  name 'UnixDateTime'

  coerce_result ->(value, _ctx) { Time.at(value).iso8601 }
end

Types::WeatherDailyData = GraphQL::ObjectType.define do
  name "WeatherDailyData"

  field :time, Types::UnixDateTimeType
  field :summary, !types.String
  field :icon, !types.String
  field :sunriseTime, Types::UnixDateTimeType
  field :sunsetTime, Types::UnixDateTimeType
  field :moonPhase, !types.Float
  field :precipIntensity, !types.Float
  field :precipIntensityMax, !types.Float
  field :precipIntensityMaxTime, Types::UnixDateTimeType
  field :precipProbability, !types.Float
  field :precipType, !types.String
  field :temperatureHigh, !types.Float
  field :temperatureHighTime, Types::UnixDateTimeType
  field :temperatureLow, !types.Float
  field :apparentTemperatureHigh, !types.Float
  field :apparentTemperatureLow, !types.Float
  field :dewPoint, !types.Int
  field :humidity, !types.Float
  field :pressure, !types.Float
  field :windSpeed, !types.Float
  field :windGust, !types.Float
  field :windBearing, !types.Int
  field :cloudCover, !types.Float
  field :uvIndex, !types.Int
  field :ozone, !types.Float
  field :temperatureMin, !types.Float
  field :temperatureMax, !types.Float
  field :apparentTemperatureMin, !types.Float
  field :apparentTemperatureMax, !types.Float
end

Types::WeatherHourlyData = GraphQL::ObjectType.define do
  name "WeatherHourlyData"

  field :time, Types::UnixDateTimeType
  field :summary, !types.String
  field :icon, !types.String
  field :precipIntensity, !types.Float
  field :precipProbability, !types.Float
  field :precipType, !types.String
  field :temperature, !types.Float
  field :apparentTemperature, !types.Float
  field :dewPoint, !types.Float
  field :humidity, !types.Float
  field :pressure, !types.Float
  field :windSpeed, !types.Float
  field :windGust, !types.Float
  field :windBearing, !types.Int
  field :cloudCover, !types.Float
  field :uvIndex, !types.Int
  field :visibility, !types.Int
  field :ozone, !types.Float
end

Types::WeatherMinutelyData = GraphQL::ObjectType.define do
  name "WeatherMinutelyData"

  field "time", Types::UnixDateTimeType
  field "precipIntensity", !types.Float
  field "precipIntensityError", !types.Float
  field "precipProbability", !types.Float
  field "precipType", !types.String
end

Types::WeatherDailyDetail = GraphQL::ObjectType.define do
  name "WeatherDailyDetail"

  field "summary", !types.String
  field "icon", !types.String
  field "data", !types[Types::WeatherDailyData]
end

Types::WeatherHourlyDetail = GraphQL::ObjectType.define do
  name "WeatherHourlyDetail"

  field "summary", !types.String
  field "icon", !types.String
  field "data", !types[Types::WeatherHourlyData]
end

Types::WeatherMinutelyDetail = GraphQL::ObjectType.define do
  name "WeatherMinutelyDetail"

  field "summary", !types.String
  field "icon", !types.String
  field "data", !types[Types::WeatherMinutelyData]
end

Types::WeatherCurrentlyDetail = GraphQL::ObjectType.define do
  name "WeatherCurrentDetail"

  field "time", Types::UnixDateTimeType
  field "summary", !types.String
  field "icon", !types.String
  field "nearestStormDistance", !types.Int
  field "nearestStormBearing", !types.Int
  field "precipIntensity", !types.Int
  field "precipProbability", !types.Int
  field "temperature", !types.Float
  field "apparentTemperature", !types.Float
  field "dewPoint", !types.Float
  field "humidity", !types.Float
  field "pressure", !types.Float
  field "windSpeed", !types.Float
  field "windGust", !types.Float
  field "windBearing", !types.Int
  field "cloudCover", !types.Float
  field "uvIndex", !types.Int
  field "visibility", !types.Int
  field "ozone", !types.Float
end

Types::WeatherType = GraphQL::ObjectType.define do
  name "Weather"

  field "latitude", !types.Float
  field "longitude", !types.Float
  field "timezone", !types.String
  field "currently", !Types::WeatherCurrentlyDetail
  field "minutely", !Types::WeatherMinutelyDetail
  field "hourly", !Types::WeatherHourlyDetail
  field "daily", !Types::WeatherDailyDetail
  field "offset", !types.Int

  # field "flags", # TODO: skipping this for now
end
