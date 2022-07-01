defmodule Helios.LocationsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Helios.Locations` context.
  """

  @doc """
  Generate a location.
  """
  def location_fixture(attrs \\ %{}) do
    {:ok, location} =
      attrs
      |> Enum.into(%{
        bathroom_code: "some bathroom_code",
        city_name: "some city_name",
        latitude: 120.5,
        longitude: 120.5,
        time_zone: "some time_zone",
        wifi_name: "some wifi_name",
        wifi_password: "some wifi_password"
      })
      |> Helios.Locations.create_location()

    location
  end
end
