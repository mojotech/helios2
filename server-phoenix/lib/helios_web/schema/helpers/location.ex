defmodule HeliosWeb.Schema.Helpers.Location do
  def sunset(dt, lat, long, offset \\ 0) do
    DateTime.add(dt, offset, :second)
    |> SunTimes.set(lat, long)
    |> DateTime.shift_zone!("Etc/UTC")
    |> DateTime.to_iso8601()
  end

  def sunrise(dt, lat, long, offset \\ 0) do
    DateTime.add(dt, offset, :second)
    |> SunTimes.rise(lat, long)
    |> DateTime.shift_zone!("Etc/UTC")
    |> DateTime.to_iso8601()
  end
end
