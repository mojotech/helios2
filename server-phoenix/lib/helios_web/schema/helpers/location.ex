defmodule HeliosWeb.Schema.Helpers.Location do
  def time_now(time_zone) do
    DateTime.now!(time_zone)
  end

  def sunset(dt, lat, long, offset \\ 0) do
    if offset !== 0 do
      DateTime.add(dt, offset, :second)
      |> SunTimes.set(lat, long)
      |> DateTime.shift_zone!("Etc/UTC")
      |> DateTime.to_iso8601()
    else
      dt
      |> SunTimes.set(lat, long)
      |> DateTime.shift_zone!("Etc/UTC")
      |> DateTime.to_iso8601()
    end
  end

  def sunrise(dt, lat, long, offset \\ 0) do
    if offset !== 0 do
      DateTime.add(dt, offset, :second)
      |> SunTimes.rise(lat, long)
      |> DateTime.shift_zone!("Etc/UTC")
      |> DateTime.to_iso8601()
    else
      dt
      |> SunTimes.rise(lat, long)
      |> DateTime.shift_zone!("Etc/UTC")
      |> DateTime.to_iso8601()
    end
  end
end
