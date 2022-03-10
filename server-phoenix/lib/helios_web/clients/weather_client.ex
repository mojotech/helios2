defmodule HeliosWeb.Clients.WeatherClient do
  @weather_api_key System.get_env("WEATHER_API_KEY")

  def forecast(location) do
    key = "openweather-response-#{location["latitude"]}-#{location["longitude"]}"
    ConCache.get_or_store(:weather_cache, key, fn ->
      get(location["latitude"], location["longitude"])
    end)
    |> Jason.decode!
  end

  defp get(latitude, longitude) do
    response = HTTPoison.get!("https://api.openweathermap.org/data/2.5/onecall?lat=#{latitude}&lon=#{longitude}&appid=#{@weather_api_key}&units=imperial")
    case response do
      %{status_code: 200, body: body} ->
        body
      %{body: body} ->
        raise body
      _ ->
        raise "Missing body from HTTP response for OpenWeather"
    end
  end
end
