defmodule HeliosWeb.Schema.Types.Weather do
  use Absinthe.Schema.Notation

  alias HeliosWeb.Schema.Resolvers.Weather

  import_types(HeliosWeb.Schema.Types.UnixDateTime)
  import_types(HeliosWeb.Schema.Types.IconIdToName)

  object :weather_temperature_data do
    field(:day, non_null(:float))
    field(:night, non_null(:float))
    field(:morn, non_null(:float))
    field(:eve, non_null(:float))
    field(:min, non_null(:float))
    field(:max, non_null(:float))
  end

  object :weather_apparent_temperature_data do
    field(:day, non_null(:float))
    field(:night, non_null(:float))
    field(:morn, non_null(:float))
    field(:eve, non_null(:float))
  end

  object :weather_info_data do
    field(:id, non_null(:integer))
    field(:main, non_null(:string))
    field(:description, non_null(:string))
    field(:icon, non_null(:icon_id_to_name))
  end

  object :weather_daily_data do
    field :time, non_null(:unix_date_time) do
      resolve(&Weather.time/3)
    end
    field :weather, non_null(:weather_info_data) do
      resolve(&Weather.weather_info_data/3)
    end
    field(:sunrise, non_null(:unix_date_time))
    field(:sunset, non_null(:unix_date_time))
    field :precip_probability, non_null(:float) do
      resolve(&Weather.precip_probability/3)
    end
    field(:rain, :float)
    field(:temp, non_null(:weather_temperature_data))
    field(:feels_like, non_null(:weather_apparent_temperature_data))
    field(:dew_point, non_null(:integer))
    field(:humidity, non_null(:integer))
    field(:pressure, non_null(:integer))
    field(:wind_speed, non_null(:float))
    field(:wind_deg, non_null(:integer))
    field(:clouds, non_null(:integer))
    field(:uvi, non_null(:integer))
  end

  object :weather_hourly_data do
    field :time, non_null(:unix_date_time) do
      resolve(&Weather.time/3)
    end
    field :weather, non_null(:weather_info_data) do
      resolve(&Weather.weather_info_data/3)
    end
    field :precip_probability, non_null(:float) do
      resolve(&Weather.precip_probability/3)
    end
    field(:temp, non_null(:float))
    field(:feels_like, non_null(:float))
    field(:dew_point, non_null(:float))
    field(:humidity, non_null(:integer))
    field(:pressure, non_null(:integer))
    field(:wind_speed, non_null(:float))
    field(:wind_gust, :float)
    field(:wind_deg, non_null(:integer))
    field(:clouds, non_null(:integer))
    field(:uvi, non_null(:integer))
    field(:visibility, non_null(:integer))
  end

  object :weather_minutely_data do
    field :time, non_null(:unix_date_time) do
      resolve(&Weather.time/3)
    end
    field(:precipitation, non_null(:float))
  end

  object :weather_currently_detail do
    field :time, non_null(:unix_date_time) do
      resolve(&Weather.time/3)
    end
    field :weather, non_null(:weather_info_data) do
      resolve(&Weather.weather_info_data/3)
    end
    field(:nearest_storm_distance, non_null(:integer))
    field(:nearest_storm_bearing, non_null(:integer))
    field(:temp, non_null(:float))
    field(:feels_like, non_null(:float))
    field(:dew_point, non_null(:float))
    field(:humidity, non_null(:integer))
    field(:pressure, non_null(:integer))
    field(:wind_speed, non_null(:float))
    field(:wind_gust, :float)
    field(:wind_deg, non_null(:integer))
    field(:clouds, non_null(:float))
    field(:uvi, non_null(:integer))
    field(:visibility, non_null(:integer))
  end

  object :weather do
    field(:lat, non_null(:float))
    field(:lon, non_null(:float))
    field :time_zone, non_null(:string) do
      resolve(&Weather.time_zone/3)
    end
    field(:current, non_null(:weather_currently_detail))
    field(:minutely, non_null(list_of(:weather_minutely_data)))
    field(:hourly, non_null(list_of(:weather_hourly_data)))
    field(:daily, non_null(list_of(:weather_daily_data)))
    field(:offset, non_null(:integer))
  end
end
