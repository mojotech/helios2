defmodule HeliosWeb.Schema.Resolvers.Widget do
  alias HeliosWeb.Clients.WeatherClient
  alias HeliosWeb.TestData.TrafficCams, as: TrafficCamsData
  alias Helios.Widget

  def day_announcements(_parent, _args, _info) do
    {:ok, []}
  end

  def weather(parent, _args, _info) do
    WeatherClient.forecast(parent)
  end

  def tweets(_parent, _args, _info) do
    {:ok, []}
  end

  def traffic_cams(_parent, _args, _info) do
    {:ok, Jason.decode!(TrafficCamsData.traffic_cams())}
  end
end
