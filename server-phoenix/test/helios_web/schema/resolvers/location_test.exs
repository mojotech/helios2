defmodule HeliosWeb.Schema.Resolvers.LocationTest do
  @moduledoc """
  Compares SunTimes sunrise/sunset calculations with
  NOAA's from their calculator: https://gml.noaa.gov/grad/solcalc/
  """
  use ExUnit.Case

  alias HeliosWeb.Schema.Helpers.Location, as: LocationHelpers

  defp testDate, do: DateTime.new!(~D[2022-03-01], ~T[00:00:00], "America/New_York")

  test "sunrise" do
    assert LocationHelpers.sunrise(testDate(), 41.823989, -71.412834) === "2022-03-01T11:21:00Z"
  end

  test "sunset" do
    assert LocationHelpers.sunset(testDate(), 41.823989, -71.412834) === "2022-03-01T22:36:00Z"
  end
end
