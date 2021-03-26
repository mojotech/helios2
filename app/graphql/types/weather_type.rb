class Types::WeatherField < Types::BaseField
  def initialize(*args, **kwargs, &block)
    kwargs.reverse_merge! hash_key: kwargs[:name]
    super(*args, **kwargs, &block)
  end
end

class Types::WeatherObject < Types::BaseObject
  field_class Types::WeatherField
end

class Types::WeatherDailyDataType < Types::WeatherObject
  field :time, Types::UnixDateTimeType
  field :summary, String
  field :icon, String
  field :sunriseTime, Types::UnixDateTimeType
  field :sunsetTime, Types::UnixDateTimeType
  field :precipIntensity, Float
  field :precipIntensityMax, Float
  field :precipIntensityMaxTime, Types::UnixDateTimeType
  field :precipProbability, Float
  field :precipType, String
  field :temperatureHigh, Float
  field :temperatureHighTime, Types::UnixDateTimeType
  field :temperatureLow, Float
  field :apparentTemperatureHigh, Float
  field :apparentTemperatureLow, Float
  field :dewPoint, Int
  field :humidity, Float
  field :pressure, Float
  field :windSpeed, Float
  field :windGust, Float
  field :windBearing, Int
  field :cloudCover, Float
  field :uvIndex, Int
  field :ozone, Float
  field :temperatureMin, Float
  field :temperatureMax, Float
  field :apparentTemperatureMin, Float
  field :apparentTemperatureMax, Float
end

class Types::WeatherHourlyDataType < Types::WeatherObject
  field :time, Types::UnixDateTimeType
  field :summary, String
  field :icon, String
  field :precipIntensity, Float
  field :precipProbability, Float
  field :precipType, String
  field :temperature, Float
  field :apparentTemperature, Float
  field :dewPoint, Float
  field :humidity, Float
  field :pressure, Float
  field :windSpeed, Float
  field :windGust, Float
  field :windBearing, Int
  field :cloudCover, Float
  field :uvIndex, Int
  field :visibility, Int
  field :ozone, Float
end

class Types::WeatherMinutelyDataType < Types::WeatherObject
  field "time", Types::UnixDateTimeType
  field "precipIntensity", Float
  field "precipIntensityError", Float
  field "precipProbability", Float
  field "precipType", String
end

class Types::WeatherDailyDetailType < Types::WeatherObject
  field "summary", String
  field "icon", String
  field "data", [Types::WeatherDailyDataType]
end

class Types::WeatherHourlyDetailType < Types::WeatherObject
  field "summary", String
  field "icon", String
  field "data", [Types::WeatherHourlyDataType]
end

class Types::WeatherMinutelyDetailType < Types::WeatherObject
  field "summary", String
  field "icon", String
  field "data", [Types::WeatherMinutelyDataType]
end

class Types::WeatherCurrentlyDetailType < Types::WeatherObject
  field "time", Types::UnixDateTimeType
  field "summary", String
  field "icon", String
  field "nearestStormDistance", Int
  field "nearestStormBearing", Int
  field "precipIntensity", Int
  field "precipProbability", Int
  field "temperature", Float
  field "apparentTemperature", Float
  field "dewPoint", Float
  field "humidity", Float
  field "pressure", Float
  field "windSpeed", Float
  field "windGust", Float
  field "windBearing", Int
  field "cloudCover", Float
  field "uvIndex", Int
  field "visibility", Int
  field "ozone", Float
end

class Types::WeatherType < Types::WeatherObject
  field "latitude", Float
  field "longitude", Float
  field "timezone", String
  field "currently", Types::WeatherCurrentlyDetailType
  field "minutely", Types::WeatherMinutelyDetailType
  field "hourly", Types::WeatherHourlyDetailType
  field "daily", Types::WeatherDailyDetailType
  field "offset", Int
  field "solarcycles", [Types::SolarcycleType]

  field "moonPhase", Float, deprecation_reason: "Moved to Location"

  # field "flags", # TODO: skipping this for now
end
