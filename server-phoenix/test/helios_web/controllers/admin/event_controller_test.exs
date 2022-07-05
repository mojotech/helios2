defmodule HeliosWeb.Admin.EventControllerTest do
  use HeliosWeb.ConnCase

  alias Helios.Events

  setup :register_and_log_in_admin

  @create_attrs %{
    external_id: "some external_id",
    source: :github_commit,
    source_author: "some source_author"
  }
  @update_attrs %{
    external_id: "some updated external_id",
    source: :github_pull,
    source_author: "some updated source_author"
  }

  def fixture(:event) do
    {:ok, event} = Events.create_event(@create_attrs)
    event
  end

  describe "index" do
    test "lists all events", %{conn: conn} do
      conn = get(conn, Routes.admin_event_path(conn, :index))
      assert html_response(conn, 200) =~ "Events"
    end
  end

  describe "new event" do
    test "renders form", %{conn: conn} do
      conn = get(conn, Routes.admin_event_path(conn, :new))
      assert html_response(conn, 200) =~ "New Event"
    end
  end

  describe "create event" do
    test "redirects to show when data is valid", %{conn: conn} do
      conn = post conn, Routes.admin_event_path(conn, :create), event: @create_attrs

      assert %{id: id} = redirected_params(conn)
      assert redirected_to(conn) == Routes.admin_event_path(conn, :show, id)

      conn = get(conn, Routes.admin_event_path(conn, :show, id))
      assert html_response(conn, 200) =~ "Event Details"
    end

    #    test "renders errors when data is invalid", %{conn: conn} do
    #      conn = post conn, Routes.admin_event_path(conn, :create), event: @invalid_attrs
    #      assert html_response(conn, 200) =~ "New Event"
    #    end
  end

  describe "edit event" do
    setup [:create_event]

    test "renders form for editing chosen event", %{conn: conn, event: event} do
      conn = get(conn, Routes.admin_event_path(conn, :edit, event))
      assert html_response(conn, 200) =~ "Edit Event"
    end
  end

  describe "update event" do
    setup [:create_event]

    test "redirects when data is valid", %{conn: conn, event: event} do
      conn = put conn, Routes.admin_event_path(conn, :update, event), event: @update_attrs
      assert redirected_to(conn) == Routes.admin_event_path(conn, :show, event)

      conn = get(conn, Routes.admin_event_path(conn, :show, event))
      assert html_response(conn, 200) =~ "some updated external_id"
    end

    #    test "renders errors when data is invalid", %{conn: conn, event: event} do
    #      conn = put conn, Routes.admin_event_path(conn, :update, event), event: @invalid_attrs
    #      assert html_response(conn, 200) =~ "Edit Event"
    #    end
  end

  describe "delete event" do
    setup [:create_event]

    test "deletes chosen event", %{conn: conn, event: event} do
      conn = delete(conn, Routes.admin_event_path(conn, :delete, event))
      assert redirected_to(conn) == Routes.admin_event_path(conn, :index)

      assert_error_sent 404, fn ->
        get(conn, Routes.admin_event_path(conn, :show, event))
      end
    end
  end

  defp create_event(_) do
    event = fixture(:event)
    {:ok, event: event}
  end
end
