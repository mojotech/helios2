defmodule HeliosWeb.Schema.Types.Weather do
  use Absinthe.Schema.Notation
  import_types(HeliosWeb.Schema.Types.UnixDateTime)
  import_types(HeliosWeb.Schema.Types.IconIdToName)

  object :weather_temperature_data do
    field(:day, :float)
    field(:night, :float)
    field(:morn, :float)
    field(:eve, :float)
    field(:min, :float)
    field(:max, :float)
  end

  object :weather_apparent_temperature_data do
    field(:day, :float)
    field(:night, :float)
    field(:morn, :float)
    field(:eve, :float)
  end

  object :weather_info_data do
    field(:id, :integer)
    field(:main, :string)
    field(:description, :string)
    field(:icon, :icon_id_to_name)
  end

  object :weather_daily_data do
    field(:time, :unix_date_time)
    field(:weather, :weather_info_data)
    field(:sunrise, :unix_date_time)
    field(:sunset, :unix_date_time)
    field(:precipProbability, :float)
    field(:rain, :float)
    field(:temp, :weather_temperature_data)
    field(:feels_like, :weather_apparent_temperature_data)
    field(:dew_point, :integer)
    field(:humidity, :integer)
    field(:pressure, :integer)
    field(:wind_speed, :float)
    field(:wind_deg, :integer)
    field(:clouds, :integer)
    field(:uvi, :integer)
  end

  object :weather_hourly_data do
    field(:time, :unix_date_time)
    field(:weather, :weather_info_data)
    field(:precipProbability, :float)
    field(:temp, :float)
    field(:feels_like, :float)
    field(:dew_point, :float)
    field(:humidity, :integer)
    field(:pressure, :integer)
    field(:wind_speed, :float)
    field(:wind_gust, :float)
    field(:wind_deg, :integer)
    field(:clouds, :integer)
    field(:uvi, :integer)
    field(:visibility, :integer)
  end

  object :weather_minutely_data do
    field(:time, :unix_date_time)
    field(:precipitation, :float)
  end

  object :weather_currently_detail do
    field(:time, :unix_date_time)
    field(:weather, :weather_info_data)
    field(:nearestStormDistance, :integer)
    field(:nearestStormBearing, :integer)
    field(:temp, :float)
    field(:feels_like, :float)
    field(:dew_point, :float)
    field(:humidity, :integer)
    field(:pressure, :integer)
    field(:wind_speed, :float)
    field(:wind_gust, :float)
    field(:wind_deg, :integer)
    field(:clouds, :float)
    field(:uvi, :integer)
    field(:visibility, :integer)
  end

  object :weather do
    field(:lat, :float)
    field(:lon, :float)
    field(:time_zone, :string)
    field(:current, :weather_currently_detail)
    field(:minutely, list_of(:weather_minutely_data))
    field(:hourly, list_of(:weather_hourly_data))
    field(:daily, list_of(:weather_daily_data))
    field(:offset, :integer)
  end
end
