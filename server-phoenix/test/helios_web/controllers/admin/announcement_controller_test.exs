defmodule HeliosWeb.Admin.AnnouncementControllerTest do
  use HeliosWeb.ConnCase

  alias Helios.Events

  @create_attrs %{
    announcement_id: "some announcement_id",
    company: "some company",
    message: "some message",
    people: "some people",
    publish_on: ~N[2022-07-04 14:42:00]
  }
  @update_attrs %{
    announcement_id: "some updated announcement_id",
    company: "some updated company",
    message: "some updated message",
    people: "some updated people",
    publish_on: ~N[2022-07-05 14:42:00]
  }
  @invalid_attrs %{announcement_id: nil, company: nil, message: nil, people: nil, publish_on: nil}

  def fixture(:announcement) do
    {:ok, announcement} = Events.create_announcement(@create_attrs)
    announcement
  end

  describe "index" do
    test "lists all announcements", %{conn: conn} do
      conn = get(conn, Routes.admin_announcement_path(conn, :index))
      assert html_response(conn, 200) =~ "Announcements"
    end
  end

  describe "new announcement" do
    test "renders form", %{conn: conn} do
      conn = get(conn, Routes.admin_announcement_path(conn, :new))
      assert html_response(conn, 200) =~ "New Announcement"
    end
  end

  describe "create announcement" do
    test "redirects to show when data is valid", %{conn: conn} do
      conn = post conn, Routes.admin_announcement_path(conn, :create), announcement: @create_attrs

      assert %{id: id} = redirected_params(conn)
      assert redirected_to(conn) == Routes.admin_announcement_path(conn, :show, id)

      conn = get(conn, Routes.admin_announcement_path(conn, :show, id))
      assert html_response(conn, 200) =~ "Announcement Details"
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn =
        post conn, Routes.admin_announcement_path(conn, :create), announcement: @invalid_attrs

      assert html_response(conn, 200) =~ "New Announcement"
    end
  end

  describe "edit announcement" do
    setup [:create_announcement]

    test "renders form for editing chosen announcement", %{conn: conn, announcement: announcement} do
      conn = get(conn, Routes.admin_announcement_path(conn, :edit, announcement))
      assert html_response(conn, 200) =~ "Edit Announcement"
    end
  end

  describe "update announcement" do
    setup [:create_announcement]

    test "redirects when data is valid", %{conn: conn, announcement: announcement} do
      conn =
        put conn, Routes.admin_announcement_path(conn, :update, announcement),
          announcement: @update_attrs

      assert redirected_to(conn) == Routes.admin_announcement_path(conn, :show, announcement)

      conn = get(conn, Routes.admin_announcement_path(conn, :show, announcement))
      assert html_response(conn, 200) =~ "some updated announcement_id"
    end

    test "renders errors when data is invalid", %{conn: conn, announcement: announcement} do
      conn =
        put conn, Routes.admin_announcement_path(conn, :update, announcement),
          announcement: @invalid_attrs

      assert html_response(conn, 200) =~ "Edit Announcement"
    end
  end

  describe "delete announcement" do
    setup [:create_announcement]

    test "deletes chosen announcement", %{conn: conn, announcement: announcement} do
      conn = delete(conn, Routes.admin_announcement_path(conn, :delete, announcement))
      assert redirected_to(conn) == Routes.admin_announcement_path(conn, :index)

      assert_error_sent 404, fn ->
        get(conn, Routes.admin_announcement_path(conn, :show, announcement))
      end
    end
  end

  defp create_announcement(_) do
    announcement = fixture(:announcement)
    {:ok, announcement: announcement}
  end
end
