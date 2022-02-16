defmodule HeliosWeb.Schema.Types.IconIdToName do
  use Absinthe.Schema.Notation

  scalar :icon_id_to_name, name: "IconIdToName" do
    serialize(fn value ->
      case value do
        "01d" ->
          "clear-day"

        "01n" ->
          "clear-night"

        "02d" ->
          "partly-cloudy-day"

        "02n" ->
          "partly-cloudy-night"

        n when n in ["03d", "03n", "04d"] ->
          "cloudy"

        n when n in ["09d", "09n", "10d", "10n"] ->
          "rain"

        n when n in ["11d", "11n"] ->
          "rain"

        n when n in ["13d", "13n"] ->
          "snow"

        n when n in ["50d", "50n"] ->
          "fog"

        _ ->
          "unknown"
      end
    end)
  end
end
