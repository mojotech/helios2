defmodule HeliosWeb.Admin.DeveloperUserControllerTest do
  use HeliosWeb.ConnCase

  alias Helios.Accounts

  setup :register_and_log_in_admin

  @create_attrs %{
    git_handle: "some git_handle",
    public_key: "some public_key",
    slack_handle: "some slack_handle"
  }
  @update_attrs %{
    git_handle: "some updated git_handle",
    public_key: "some updated public_key",
    slack_handle: "some updated slack_handle"
  }
  @invalid_attrs %{git_handle: nil, public_key: nil, slack_handle: nil}

  def fixture(:developer_user) do
    {:ok, developer_user} = Accounts.create_developer_user(@create_attrs)
    developer_user
  end

  describe "index" do
    test "lists all developer_users", %{conn: conn} do
      conn = get(conn, Routes.admin_developer_user_path(conn, :index))
      assert html_response(conn, 200) =~ "Developer users"
    end
  end

  describe "new developer_user" do
    test "renders form", %{conn: conn} do
      conn = get(conn, Routes.admin_developer_user_path(conn, :new))
      assert html_response(conn, 200) =~ "New Developer user"
    end
  end

  describe "create developer_user" do
    test "redirects to show when data is valid", %{conn: conn} do
      conn =
        post conn, Routes.admin_developer_user_path(conn, :create), developer_user: @create_attrs

      assert %{id: id} = redirected_params(conn)
      assert redirected_to(conn) == Routes.admin_developer_user_path(conn, :show, id)

      conn = get(conn, Routes.admin_developer_user_path(conn, :show, id))
      assert html_response(conn, 200) =~ "Developer user Details"
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn =
        post conn, Routes.admin_developer_user_path(conn, :create), developer_user: @invalid_attrs

      assert html_response(conn, 200) =~ "New Developer user"
    end
  end

  describe "edit developer_user" do
    setup [:create_developer_user]

    test "renders form for editing chosen developer_user", %{
      conn: conn,
      developer_user: developer_user
    } do
      conn = get(conn, Routes.admin_developer_user_path(conn, :edit, developer_user))
      assert html_response(conn, 200) =~ "Edit Developer user"
    end
  end

  describe "update developer_user" do
    setup [:create_developer_user]

    test "redirects when data is valid", %{conn: conn, developer_user: developer_user} do
      conn =
        put conn, Routes.admin_developer_user_path(conn, :update, developer_user),
          developer_user: @update_attrs

      assert redirected_to(conn) == Routes.admin_developer_user_path(conn, :show, developer_user)

      conn = get(conn, Routes.admin_developer_user_path(conn, :show, developer_user))
      assert html_response(conn, 200) =~ "some updated git_handle"
    end

    test "renders errors when data is invalid", %{conn: conn, developer_user: developer_user} do
      conn =
        put conn, Routes.admin_developer_user_path(conn, :update, developer_user),
          developer_user: @invalid_attrs

      assert html_response(conn, 200) =~ "Edit Developer user"
    end
  end

  describe "delete developer_user" do
    setup [:create_developer_user]

    test "deletes chosen developer_user", %{conn: conn, developer_user: developer_user} do
      conn = delete(conn, Routes.admin_developer_user_path(conn, :delete, developer_user))
      assert redirected_to(conn) == Routes.admin_developer_user_path(conn, :index)

      assert_error_sent 404, fn ->
        get(conn, Routes.admin_developer_user_path(conn, :show, developer_user))
      end
    end
  end

  defp create_developer_user(_) do
    developer_user = fixture(:developer_user)
    {:ok, developer_user: developer_user}
  end
end
