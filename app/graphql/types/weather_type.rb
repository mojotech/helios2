class Types::WeatherField < Types::BaseField
  def initialize(*args, **kwargs, &block)
    kwargs.reverse_merge! hash_key: kwargs[:name]
    super(*args, **kwargs, &block)
  end
end

class Types::WeatherObject < Types::BaseObject
  field_class Types::WeatherField
end

class Types::WeatherTemperatureDataType < Types::WeatherObject
  field :day, Float
  field :night, Float
  field :morn, Float
  field :eve, Float
  field :min, Float
  field :max, Float
end

class Types::WeatherApparentTemperatureDataType < Types::WeatherObject
  field :day, Float
  field :night, Float
  field :morn, Float
  field :eve, Float
end

class Types::WeatherInfoDataType < Types::WeatherObject
  def initialize(value, context, **kwargs, &block)
    # Weather data is always an array of one object, this unwraps that object
    super(value[0], context, **kwargs, &block)
  end

  field "id", Integer
  field "main", String
  field "description", String, resolve: ->(obj, _args, _ctx) { obj["description"].to_s.humanize }
  field "icon", Types::IconIdToNameType
end

class Types::WeatherDailyDataType < Types::WeatherObject
  field "time", Types::UnixDateTimeType, hash_key: "dt"
  field "weather", Types::WeatherInfoDataType
  field :sunrise, Types::UnixDateTimeType
  field :sunset, Types::UnixDateTimeType
  field "precipProbability", Float, hash_key: "pop"
  field :rain, Float, null: true
  field :temp, Types::WeatherTemperatureDataType
  field :feels_like, Types::WeatherApparentTemperatureDataType
  field :dew_point, Int
  field :humidity, Int
  field :pressure, Int
  field :wind_speed, Float
  field :wind_deg, Int
  field :clouds, Int
  field :uvi, Float
end

class Types::WeatherHourlyDataType < Types::WeatherObject
  field "time", Types::UnixDateTimeType, hash_key: "dt"
  field "weather", Types::WeatherInfoDataType
  field "precipProbability", Float, hash_key: "pop"
  field :temp, Float
  field :feels_like, Float
  field :dew_point, Float
  field :humidity, Int
  field :pressure, Int
  field :wind_speed, Float
  field :wind_gust, Float, null: true
  field :wind_deg, Int
  field :clouds, Int
  field :uvi, Float
  field :visibility, Int
end

class Types::WeatherMinutelyDataType < Types::WeatherObject
  field "time", Types::UnixDateTimeType, hash_key: "dt"
  field "precipitation", Float
end

class Types::WeatherCurrentlyDetailType < Types::WeatherObject
  field "time", Types::UnixDateTimeType, hash_key: "dt"
  field "weather", Types::WeatherInfoDataType
  field "nearestStormDistance", Int
  field "nearestStormBearing", Int
  field "temp", Float
  field "feels_like", Float
  field "dew_point", Float
  field "humidity", Int
  field "pressure", Int
  field "wind_speed", Float
  field "wind_gust", Float, null: true
  field "wind_deg", Int
  field "clouds", Float
  field "uvi", Float
  field "visibility", Int
end

class Types::WeatherType < Types::WeatherObject
  field "lat", Float
  field "lon", Float
  field "time_zone", String, hash_key: :timezone
  field "current", Types::WeatherCurrentlyDetailType
  field "minutely", [Types::WeatherMinutelyDataType]
  field "hourly", [Types::WeatherHourlyDataType]
  field "daily", [Types::WeatherDailyDataType]
  field "offset", Int

  field "moonPhase", Float, deprecation_reason: "Moved to Location"

  # field "flags", # TODO: skipping this for now
end
