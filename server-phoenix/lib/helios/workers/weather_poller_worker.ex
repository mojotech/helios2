defmodule Helios.Workers.WeatherPollerWorker do
  use Absinthe.Schema.Notation
  import Ecto.Query
  alias HeliosWeb.Schema.Types.Sub
  alias HeliosWeb.Clients.WeatherClient

  def perform do
    IO.puts("Running weather poll")

    Enum.each(locations, fn location ->
      get_forecast(location)
    end)
  end

  def subscriptions do
    Sub.get_args() |> Enum.uniq()
  end

  defmodule LocationParams do
    defstruct [:latitude, :longitude]
  end

  def locations do
    Enum.map(subscriptions, fn subscription ->
      %LocationParams{latitude: subscription.latitude, longitude: subscription.longitude}
    end)
  end

  def get_forecast(location) do
    case WeatherClient.forecast(%{latitude: location.latitude, longitude: location.longitude}) do
      {:ok, forecast_data} ->
        Absinthe.Subscription.publish(
          HeliosWeb.Endpoint,
          forecast_data,
          weather_published: [location.latitude, location.longitude]
        )

      {:error, message} ->
        IO.puts("Failure polling #{location.latitude} and #{location.longitude}: #{message}")
    end
  end
end
