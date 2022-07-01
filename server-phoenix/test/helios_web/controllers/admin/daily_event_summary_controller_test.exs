defmodule HeliosWeb.Admin.DailyEventSummaryControllerTest do
  use HeliosWeb.ConnCase

  alias Helios.Events

  @create_attrs %{count: 42, day: ~D[2022-07-04], source: "some source"}
  @update_attrs %{count: 43, day: ~D[2022-07-05], source: "some updated source"}
  @invalid_attrs %{count: nil, day: nil, source: nil}

  def fixture(:daily_event_summary) do
    {:ok, daily_event_summary} = Events.create_daily_event_summary(@create_attrs)
    daily_event_summary
  end

  describe "index" do
    test "lists all daily_event_summaries", %{conn: conn} do
      conn = get(conn, Routes.admin_daily_event_summary_path(conn, :index))
      assert html_response(conn, 200) =~ "Daily event summaries"
    end
  end

  describe "new daily_event_summary" do
    test "renders form", %{conn: conn} do
      conn = get(conn, Routes.admin_daily_event_summary_path(conn, :new))
      assert html_response(conn, 200) =~ "New Daily event summary"
    end
  end

  describe "create daily_event_summary" do
    test "redirects to show when data is valid", %{conn: conn} do
      conn =
        post conn, Routes.admin_daily_event_summary_path(conn, :create),
          daily_event_summary: @create_attrs

      assert %{id: id} = redirected_params(conn)
      assert redirected_to(conn) == Routes.admin_daily_event_summary_path(conn, :show, id)

      conn = get(conn, Routes.admin_daily_event_summary_path(conn, :show, id))
      assert html_response(conn, 200) =~ "Daily event summary Details"
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn =
        post conn, Routes.admin_daily_event_summary_path(conn, :create),
          daily_event_summary: @invalid_attrs

      assert html_response(conn, 200) =~ "New Daily event summary"
    end
  end

  describe "edit daily_event_summary" do
    setup [:create_daily_event_summary]

    test "renders form for editing chosen daily_event_summary", %{
      conn: conn,
      daily_event_summary: daily_event_summary
    } do
      conn = get(conn, Routes.admin_daily_event_summary_path(conn, :edit, daily_event_summary))
      assert html_response(conn, 200) =~ "Edit Daily event summary"
    end
  end

  describe "update daily_event_summary" do
    setup [:create_daily_event_summary]

    test "redirects when data is valid", %{conn: conn, daily_event_summary: daily_event_summary} do
      conn =
        put conn, Routes.admin_daily_event_summary_path(conn, :update, daily_event_summary),
          daily_event_summary: @update_attrs

      assert redirected_to(conn) ==
               Routes.admin_daily_event_summary_path(conn, :show, daily_event_summary)

      conn = get(conn, Routes.admin_daily_event_summary_path(conn, :show, daily_event_summary))
      assert html_response(conn, 200) =~ "some updated source"
    end

    test "renders errors when data is invalid", %{
      conn: conn,
      daily_event_summary: daily_event_summary
    } do
      conn =
        put conn, Routes.admin_daily_event_summary_path(conn, :update, daily_event_summary),
          daily_event_summary: @invalid_attrs

      assert html_response(conn, 200) =~ "Edit Daily event summary"
    end
  end

  describe "delete daily_event_summary" do
    setup [:create_daily_event_summary]

    test "deletes chosen daily_event_summary", %{
      conn: conn,
      daily_event_summary: daily_event_summary
    } do
      conn =
        delete(conn, Routes.admin_daily_event_summary_path(conn, :delete, daily_event_summary))

      assert redirected_to(conn) == Routes.admin_daily_event_summary_path(conn, :index)

      assert_error_sent 404, fn ->
        get(conn, Routes.admin_daily_event_summary_path(conn, :show, daily_event_summary))
      end
    end
  end

  defp create_daily_event_summary(_) do
    daily_event_summary = fixture(:daily_event_summary)
    {:ok, daily_event_summary: daily_event_summary}
  end
end
