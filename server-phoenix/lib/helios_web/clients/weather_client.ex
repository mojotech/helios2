defmodule HeliosWeb.Clients.WeatherClient do
  defp weather_api_key, do: System.get_env("WEATHER_API_KEY")

  def forecast(%{latitude: latitude, longitude: longitude}) do
    key = "openweather-response-#{latitude}-#{longitude}"

    ConCache.get_or_store(:weather_cache, key, fn ->
      case get(latitude, longitude) do
        {:ok, body} ->
          {:ok, Jason.decode!(body)}

        error ->
          %ConCache.Item{value: error, ttl: 0}
      end
    end)
  end

  defp get(latitude, longitude) do
    response =
      HTTPoison.get!(
        "https://api.openweathermap.org/data/2.5/onecall?lat=#{latitude}&lon=#{longitude}&appid=#{weather_api_key()}&units=imperial"
      )

    case response do
      %{status_code: 200, body: body} ->
        {:ok, body}

      %{body: body} ->
        body = body |> Jason.decode!()
        {:error, body["message"]}
    end
  end
end
