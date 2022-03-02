defmodule HeliosWeb.Schema.Helpers.Location do
  def time_now(time_zone) do
    DateTime.now!(time_zone)
  end

  def sunset(lat, long, offset \\ "today") do
    response = HTTPoison.get!("https://api.sunrise-sunset.org/json?lat=#{lat}&lng=#{long}&formatted=0&date=#{offset}")
    data = Jason.decode!(response.body)
    IO.inspect(data)
    data["results"]["sunset"]
  end

  def sunrise(lat, long, offset \\ "today") do
    response = HTTPoison.get!("https://api.sunrise-sunset.org/json?lat=#{lat}&lng=#{long}&formatted=0&date=#{offset}")
    data = Jason.decode!(response.body)
    data["results"]["sunrise"]
  end
end
