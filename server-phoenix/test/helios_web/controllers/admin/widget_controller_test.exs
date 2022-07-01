defmodule HeliosWeb.Admin.WidgetControllerTest do
  use HeliosWeb.ConnCase

  alias Helios.Widgets

  @create_attrs %{
    duration_seconds: 42,
    enabled: true,
    name: "some name",
    position: 42,
    show_weather: true,
    sidebar_text: "some sidebar_text",
    start: ~T[14:00:00],
    stop: ~T[14:00:00]
  }
  @update_attrs %{
    duration_seconds: 43,
    enabled: false,
    name: "some updated name",
    position: 43,
    show_weather: false,
    sidebar_text: "some updated sidebar_text",
    start: ~T[15:01:01],
    stop: ~T[15:01:01]
  }
  @invalid_attrs %{
    duration_seconds: nil,
    enabled: nil,
    name: nil,
    position: nil,
    show_weather: nil,
    sidebar_text: nil,
    start: nil,
    stop: nil
  }

  def fixture(:widget) do
    {:ok, widget} = Widgets.create_widget(@create_attrs)
    widget
  end

  describe "index" do
    test "lists all widgets", %{conn: conn} do
      conn = get(conn, Routes.admin_widget_path(conn, :index))
      assert html_response(conn, 200) =~ "Widgets"
    end
  end

  describe "new widget" do
    test "renders form", %{conn: conn} do
      conn = get(conn, Routes.admin_widget_path(conn, :new))
      assert html_response(conn, 200) =~ "New Widget"
    end
  end

  describe "create widget" do
    test "redirects to show when data is valid", %{conn: conn} do
      conn = post conn, Routes.admin_widget_path(conn, :create), widget: @create_attrs

      assert %{id: id} = redirected_params(conn)
      assert redirected_to(conn) == Routes.admin_widget_path(conn, :show, id)

      conn = get(conn, Routes.admin_widget_path(conn, :show, id))
      assert html_response(conn, 200) =~ "Widget Details"
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post conn, Routes.admin_widget_path(conn, :create), widget: @invalid_attrs
      assert html_response(conn, 200) =~ "New Widget"
    end
  end

  describe "edit widget" do
    setup [:create_widget]

    test "renders form for editing chosen widget", %{conn: conn, widget: widget} do
      conn = get(conn, Routes.admin_widget_path(conn, :edit, widget))
      assert html_response(conn, 200) =~ "Edit Widget"
    end
  end

  describe "update widget" do
    setup [:create_widget]

    test "redirects when data is valid", %{conn: conn, widget: widget} do
      conn = put conn, Routes.admin_widget_path(conn, :update, widget), widget: @update_attrs
      assert redirected_to(conn) == Routes.admin_widget_path(conn, :show, widget)

      conn = get(conn, Routes.admin_widget_path(conn, :show, widget))
      assert html_response(conn, 200) =~ "some updated name"
    end

    test "renders errors when data is invalid", %{conn: conn, widget: widget} do
      conn = put conn, Routes.admin_widget_path(conn, :update, widget), widget: @invalid_attrs
      assert html_response(conn, 200) =~ "Edit Widget"
    end
  end

  describe "delete widget" do
    setup [:create_widget]

    test "deletes chosen widget", %{conn: conn, widget: widget} do
      conn = delete(conn, Routes.admin_widget_path(conn, :delete, widget))
      assert redirected_to(conn) == Routes.admin_widget_path(conn, :index)

      assert_error_sent 404, fn ->
        get(conn, Routes.admin_widget_path(conn, :show, widget))
      end
    end
  end

  defp create_widget(_) do
    widget = fixture(:widget)
    {:ok, widget: widget}
  end
end
