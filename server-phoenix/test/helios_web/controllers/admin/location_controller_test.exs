defmodule HeliosWeb.Admin.LocationControllerTest do
  use HeliosWeb.ConnCase

  alias Helios.Locations

  @create_attrs %{
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

  def fixture(:location) do
    {:ok, location} = Locations.create_location(@create_attrs)
    location
  end

  describe "index" do
    test "lists all locations", %{conn: conn} do
      conn = get(conn, Routes.admin_location_path(conn, :index))
      assert html_response(conn, 200) =~ "Locations"
    end
  end

  describe "new location" do
    test "renders form", %{conn: conn} do
      conn = get(conn, Routes.admin_location_path(conn, :new))
      assert html_response(conn, 200) =~ "New Location"
    end
  end

  describe "create location" do
    test "redirects to show when data is valid", %{conn: conn} do
      conn = post conn, Routes.admin_location_path(conn, :create), location: @create_attrs

      assert %{id: id} = redirected_params(conn)
      assert redirected_to(conn) == Routes.admin_location_path(conn, :show, id)

      conn = get(conn, Routes.admin_location_path(conn, :show, id))
      assert html_response(conn, 200) =~ "Location Details"
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post conn, Routes.admin_location_path(conn, :create), location: @invalid_attrs
      assert html_response(conn, 200) =~ "New Location"
    end
  end

  describe "edit location" do
    setup [:create_location]

    test "renders form for editing chosen location", %{conn: conn, location: location} do
      conn = get(conn, Routes.admin_location_path(conn, :edit, location))
      assert html_response(conn, 200) =~ "Edit Location"
    end
  end

  describe "update location" do
    setup [:create_location]

    test "redirects when data is valid", %{conn: conn, location: location} do
      conn =
        put conn, Routes.admin_location_path(conn, :update, location), location: @update_attrs

      assert redirected_to(conn) == Routes.admin_location_path(conn, :show, location)

      conn = get(conn, Routes.admin_location_path(conn, :show, location))
      assert html_response(conn, 200) =~ "some updated bathroom_code"
    end

    test "renders errors when data is invalid", %{conn: conn, location: location} do
      conn =
        put conn, Routes.admin_location_path(conn, :update, location), location: @invalid_attrs

      assert html_response(conn, 200) =~ "Edit Location"
    end
  end

  describe "delete location" do
    setup [:create_location]

    test "deletes chosen location", %{conn: conn, location: location} do
      conn = delete(conn, Routes.admin_location_path(conn, :delete, location))
      assert redirected_to(conn) == Routes.admin_location_path(conn, :index)

      assert_error_sent 404, fn ->
        get(conn, Routes.admin_location_path(conn, :show, location))
      end
    end
  end

  defp create_location(_) do
    location = fixture(:location)
    {:ok, location: location}
  end
end
