defmodule HeliosWeb.Schema.Resolvers.Location do
  alias HeliosWeb.Schema.Helpers.Location, as: LocationHelpers
  alias Helios.{Repo, Location, Announcement}

  def location(_parent, %{city_name: city_name}, _info) do
    {:ok, Repo.get_by(Location, city_name: city_name)}
  end

  def location(_parent, _args, _info) do
    {:ok, Repo.get_by(Location, city_name: System.get_env("PRIMARY_CITY_NAME"))}
  end

  def weather(_parent, _args, _info) do
    {:ok, Jason.decode!(WeatherData.weather())}
  end

  def traffic_cams(_parent, _args, _info) do
    {:ok, Jason.decode!(TrafficCamsData.traffic_cams())}
  end

  def solar_cycles(parent, _args, _info) do
    today = DateTime.now!(parent.time_zone)
    yesterday_sunset = LocationHelpers.sunset(today, parent.latitude, parent.longitude, -86400)
    today_sunrise = LocationHelpers.sunrise(today, parent.latitude, parent.longitude)
    today_sunset = LocationHelpers.sunset(today, parent.latitude, parent.longitude)
    tomorrow_sunrise = LocationHelpers.sunrise(today, parent.latitude, parent.longitude, 86400)

    cycles = [
      %{time: yesterday_sunset, type: "sunset"},
      %{time: today_sunrise, type: "sunrise"},
      %{time: today_sunset, type: "sunset"},
      %{time: tomorrow_sunrise, type: "sunrise"}
    ]

    {:ok, cycles}
  end

  @moon_cycle_time 2_551_442.8
  @first_new_moon_epoch 592_500

  def moon_phase(parent, _args, _info) do
    phase_ratio =
      rem(
        DateTime.to_unix(DateTime.now!(parent.time_zone)) - @first_new_moon_epoch,
        round(@moon_cycle_time)
      ) / @moon_cycle_time

    {:ok, round(phase_ratio * 8) * 0.125}
  end

  def day_announcements(parent, _args, _info) do
    # {:ok, Repo.all(Announcement |> Announcement.happen_today(parent.time_zone))}
    {:ok, Repo.all(Announcement |> Announcement.happen_today())}
  end

  def primary?(parent, _args, _info) do
    result = parent.city_name === System.get_env("PRIMARY_CITY_NAME")

    {:ok, result}
  end
end
