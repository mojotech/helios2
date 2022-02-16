defmodule HeliosWeb.Schema.Resolvers.Location do
  defp test_query(city_name) do
    case city_name do
      "Providence" ->
        %{
          latitude: 41.823989,
          longitude: -71.412834,
          time_zone: "America/New_York",
          wifi_name: "mojotech-guest",
          wifi_password: "p@ssw0rd",
          bathroom_code: "0000*"
        }

      "Boulder" ->
        %{
          latitude: 40.014986,
          longitude: -105.270546,
          time_zone: "America/Denver",
          wifi_name: "mojotech-guest",
          wifi_password: "p@ssw0rd",
          bathroom_code: "0000*"
        }
    end
  end

  def location(%{city_name: city_name}, _info) do
    {:ok, test_query(city_name)}
  end
end
