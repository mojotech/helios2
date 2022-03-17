defmodule HeliosWeb.Schema.Resolvers.Widget do
  alias HeliosWeb.TestData.Weather, as: WeatherData
  alias HeliosWeb.TestData.TrafficCams, as: TrafficCamsData

  def day_announcements(_parent, _args, _info) do
    {:ok, []}
  end

  def weather(_parent, _args, _info) do
    {:ok, Jason.decode!(WeatherData.weather())}
  end

  def tweets(_parent, _args, _info) do
    {:ok, []}
  end

  def traffic_cams(_parent, _args, _info) do
    {:ok, Jason.decode!(TrafficCamsData.traffic_cams())}
  end
end
