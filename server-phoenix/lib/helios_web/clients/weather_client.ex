defmodule HeliosWeb.Clients.WeatherClient do
  defp weather_api_key, do: System.get_env("WEATHER_API_KEY")

  def forecast(%{latitude: latitude, longitude: longitude}) do
    key = "openweather-response-#{latitude}-#{longitude}"

    case get(latitude, longitude) do
      {:ok, body} ->
        {:ok,
         ConCache.get_or_store(:weather_cache, key, fn ->
           body
         end)
         |> Jason.decode!()}

      {:error, message} ->
        {:error, message}
    end
  end

  defp get(latitude, longitude) do
    response =
      HTTPoison.get!(
        "https://api.openweathermap.org/data/2.5/onecall?lat=#{latitude}&lon=#{longitude}&appid=#{weather_api_key}&units=imperial"
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
