defmodule HeliosWeb.Admin.TrafficCamControllerTest do
  use HeliosWeb.ConnCase

  alias Helios.Widgets

  setup :register_and_log_in_admin

  @create_attrs %{feed_format: "some feed_format", title: "some title", url: "some url"}
  @update_attrs %{
    feed_format: "some updated feed_format",
    title: "some updated title",
    url: "some updated url"
  }
  @invalid_attrs %{feed_format: nil, title: nil, url: nil}

  def fixture(:traffic_cam) do
    {:ok, traffic_cam} = Widgets.create_traffic_cam(@create_attrs)
    traffic_cam
  end

  describe "index" do
    test "lists all traffic_cams", %{conn: conn} do
      conn = get(conn, Routes.admin_traffic_cam_path(conn, :index))
      assert html_response(conn, 200) =~ "Traffic cams"
    end
  end

  describe "new traffic_cam" do
    test "renders form", %{conn: conn} do
      conn = get(conn, Routes.admin_traffic_cam_path(conn, :new))
      assert html_response(conn, 200) =~ "New Traffic cam"
    end
  end

  describe "create traffic_cam" do
    test "redirects to show when data is valid", %{conn: conn} do
      conn = post conn, Routes.admin_traffic_cam_path(conn, :create), traffic_cam: @create_attrs

      assert %{id: id} = redirected_params(conn)
      assert redirected_to(conn) == Routes.admin_traffic_cam_path(conn, :show, id)

      conn = get(conn, Routes.admin_traffic_cam_path(conn, :show, id))
      assert html_response(conn, 200) =~ "Traffic cam Details"
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post conn, Routes.admin_traffic_cam_path(conn, :create), traffic_cam: @invalid_attrs
      assert html_response(conn, 200) =~ "New Traffic cam"
    end
  end

  describe "edit traffic_cam" do
    setup [:create_traffic_cam]

    test "renders form for editing chosen traffic_cam", %{conn: conn, traffic_cam: traffic_cam} do
      conn = get(conn, Routes.admin_traffic_cam_path(conn, :edit, traffic_cam))
      assert html_response(conn, 200) =~ "Edit Traffic cam"
    end
  end

  describe "update traffic_cam" do
    setup [:create_traffic_cam]

    test "redirects when data is valid", %{conn: conn, traffic_cam: traffic_cam} do
      conn =
        put conn, Routes.admin_traffic_cam_path(conn, :update, traffic_cam),
          traffic_cam: @update_attrs

      assert redirected_to(conn) == Routes.admin_traffic_cam_path(conn, :show, traffic_cam)

      conn = get(conn, Routes.admin_traffic_cam_path(conn, :show, traffic_cam))
      assert html_response(conn, 200) =~ "some updated feed_format"
    end

    test "renders errors when data is invalid", %{conn: conn, traffic_cam: traffic_cam} do
      conn =
        put conn, Routes.admin_traffic_cam_path(conn, :update, traffic_cam),
          traffic_cam: @invalid_attrs

      assert html_response(conn, 200) =~ "Edit Traffic cam"
    end
  end

  describe "delete traffic_cam" do
    setup [:create_traffic_cam]

    test "deletes chosen traffic_cam", %{conn: conn, traffic_cam: traffic_cam} do
      conn = delete(conn, Routes.admin_traffic_cam_path(conn, :delete, traffic_cam))
      assert redirected_to(conn) == Routes.admin_traffic_cam_path(conn, :index)

      assert_error_sent 404, fn ->
        get(conn, Routes.admin_traffic_cam_path(conn, :show, traffic_cam))
      end
    end
  end

  defp create_traffic_cam(_) do
    traffic_cam = fixture(:traffic_cam)
    {:ok, traffic_cam: traffic_cam}
  end
end
