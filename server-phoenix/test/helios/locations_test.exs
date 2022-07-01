defmodule Helios.LocationsTest do
  use Helios.DataCase

  alias Helios.Locations

  alias Helios.Locations.Location

  @valid_attrs %{
    bathroom_code: "some bathroom_code",
    city_name: "some city_name",
    latitude: 120.5,
    longitude: 120.5,
    time_zone: "some time_zone",
    wifi_name: "some wifi_name",
    wifi_password: "some wifi_password"
  }
  @update_attrs %{
    bathroom_code: "some updated bathroom_code",
    city_name: "some updated city_name",
    latitude: 456.7,
    longitude: 456.7,
    time_zone: "some updated time_zone",
    wifi_name: "some updated wifi_name",
    wifi_password: "some updated wifi_password"
  }
  @invalid_attrs %{
    bathroom_code: nil,
    city_name: nil,
    latitude: nil,
    longitude: nil,
    time_zone: nil,
    wifi_name: nil,
    wifi_password: nil
  }

  #  describe "#paginate_locations/1" do
  #    test "returns paginated list of locations" do
  #      for _ <- 1..20 do
  #        location_fixture()
  #      end
  #
  #      {:ok, %{locations: locations} = page} = Locations.paginate_locations(%{})
  #
  #      assert length(locations) == 15
  #      assert page.page_number == 1
  #      assert page.page_size == 15
  #      assert page.total_pages == 2
  #      assert page.total_entries == 20
  #      assert page.distance == 5
  #      assert page.sort_field == "inserted_at"
  #      assert page.sort_direction == "desc"
  #    end
  #  end

  describe "#list_locations/0" do
    test "returns all locations" do
      location = location_fixture()
      assert Locations.list_locations() == [location]
    end
  end

  describe "#get_location!/1" do
    test "returns the location with given id" do
      location = location_fixture()
      assert Locations.get_location!(location.id) == location
    end
  end

  describe "#create_location/1" do
    test "with valid data creates a location" do
      assert {:ok, %Location{} = location} = Locations.create_location(@valid_attrs)
      assert location.bathroom_code == "some bathroom_code"
      assert location.city_name == "some city_name"
      assert location.latitude == 120.5
      assert location.longitude == 120.5
      assert location.time_zone == "some time_zone"
      assert location.wifi_name == "some wifi_name"
      assert location.wifi_password == "some wifi_password"
    end

    test "with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Locations.create_location(@invalid_attrs)
    end
  end

  describe "#update_location/2" do
    test "with valid data updates the location" do
      location = location_fixture()
      assert {:ok, location} = Locations.update_location(location, @update_attrs)
      assert %Location{} = location
      assert location.bathroom_code == "some updated bathroom_code"
      assert location.city_name == "some updated city_name"
      assert location.latitude == 456.7
      assert location.longitude == 456.7
      assert location.time_zone == "some updated time_zone"
      assert location.wifi_name == "some updated wifi_name"
      assert location.wifi_password == "some updated wifi_password"
    end

    test "with invalid data returns error changeset" do
      location = location_fixture()
      assert {:error, %Ecto.Changeset{}} = Locations.update_location(location, @invalid_attrs)
      assert location == Locations.get_location!(location.id)
    end
  end

  describe "#delete_location/1" do
    test "deletes the location" do
      location = location_fixture()
      assert {:ok, %Location{}} = Locations.delete_location(location)
      assert_raise Ecto.NoResultsError, fn -> Locations.get_location!(location.id) end
    end
  end

  describe "#change_location/1" do
    test "returns a location changeset" do
      location = location_fixture()
      assert %Ecto.Changeset{} = Locations.change_location(location)
    end
  end

  def location_fixture(attrs \\ %{}) do
    {:ok, location} =
      attrs
      |> Enum.into(@valid_attrs)
      |> Locations.create_location()

    location
  end
end
