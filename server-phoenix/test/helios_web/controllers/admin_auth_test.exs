defmodule HeliosWeb.AdminAuthTest do
  use HeliosWeb.ConnCase, async: true

  alias Helios.Accounts
  alias HeliosWeb.AdminAuth
  import Helios.AccountsFixtures

  @remember_me_cookie "_helios_web_admin_remember_me"

  setup %{conn: conn} do
    conn =
      conn
      |> Map.replace!(:secret_key_base, HeliosWeb.Endpoint.config(:secret_key_base))
      |> init_test_session(%{})

    %{admin: admin_fixture(), conn: conn}
  end

  describe "log_in_admin/3" do
    test "stores the admin token in the session", %{conn: conn, admin: admin} do
      conn = AdminAuth.log_in_admin(conn, admin)
      assert token = get_session(conn, :admin_token)
      assert get_session(conn, :live_socket_id) == "admins_sessions:#{Base.url_encode64(token)}"
      assert redirected_to(conn) == "/"
      assert Accounts.get_admin_by_session_token(token)
    end

    test "clears everything previously stored in the session", %{conn: conn, admin: admin} do
      conn = conn |> put_session(:to_be_removed, "value") |> AdminAuth.log_in_admin(admin)
      refute get_session(conn, :to_be_removed)
    end

    test "redirects to the configured path", %{conn: conn, admin: admin} do
      conn = conn |> put_session(:admin_return_to, "/hello") |> AdminAuth.log_in_admin(admin)
      assert redirected_to(conn) == "/hello"
    end

    test "writes a cookie if remember_me is configured", %{conn: conn, admin: admin} do
      conn = conn |> fetch_cookies() |> AdminAuth.log_in_admin(admin, %{"remember_me" => "true"})
      assert get_session(conn, :admin_token) == conn.cookies[@remember_me_cookie]

      assert %{value: signed_token, max_age: max_age} = conn.resp_cookies[@remember_me_cookie]
      assert signed_token != get_session(conn, :admin_token)
      assert max_age == 5_184_000
    end
  end

  describe "logout_admin/1" do
    test "erases session and cookies", %{conn: conn, admin: admin} do
      admin_token = Accounts.generate_admin_session_token(admin)

      conn =
        conn
        |> put_session(:admin_token, admin_token)
        |> put_req_cookie(@remember_me_cookie, admin_token)
        |> fetch_cookies()
        |> AdminAuth.log_out_admin()

      refute get_session(conn, :admin_token)
      refute conn.cookies[@remember_me_cookie]
      assert %{max_age: 0} = conn.resp_cookies[@remember_me_cookie]
      assert redirected_to(conn) == "/"
      refute Accounts.get_admin_by_session_token(admin_token)
    end

    test "broadcasts to the given live_socket_id", %{conn: conn} do
      live_socket_id = "admins_sessions:abcdef-token"
      HeliosWeb.Endpoint.subscribe(live_socket_id)

      conn
      |> put_session(:live_socket_id, live_socket_id)
      |> AdminAuth.log_out_admin()

      assert_receive %Phoenix.Socket.Broadcast{event: "disconnect", topic: ^live_socket_id}
    end

    test "works even if admin is already logged out", %{conn: conn} do
      conn = conn |> fetch_cookies() |> AdminAuth.log_out_admin()
      refute get_session(conn, :admin_token)
      assert %{max_age: 0} = conn.resp_cookies[@remember_me_cookie]
      assert redirected_to(conn) == "/"
    end
  end

  describe "fetch_current_admin/2" do
    test "authenticates admin from session", %{conn: conn, admin: admin} do
      admin_token = Accounts.generate_admin_session_token(admin)
      conn = conn |> put_session(:admin_token, admin_token) |> AdminAuth.fetch_current_admin([])
      assert conn.assigns.current_admin.id == admin.id
    end

    test "authenticates admin from cookies", %{conn: conn, admin: admin} do
      logged_in_conn =
        conn |> fetch_cookies() |> AdminAuth.log_in_admin(admin, %{"remember_me" => "true"})

      admin_token = logged_in_conn.cookies[@remember_me_cookie]
      %{value: signed_token} = logged_in_conn.resp_cookies[@remember_me_cookie]

      conn =
        conn
        |> put_req_cookie(@remember_me_cookie, signed_token)
        |> AdminAuth.fetch_current_admin([])

      assert get_session(conn, :admin_token) == admin_token
      assert conn.assigns.current_admin.id == admin.id
    end

    test "does not authenticate if data is missing", %{conn: conn, admin: admin} do
      _ = Accounts.generate_admin_session_token(admin)
      conn = AdminAuth.fetch_current_admin(conn, [])
      refute get_session(conn, :admin_token)
      refute conn.assigns.current_admin
    end
  end

  describe "redirect_if_admin_is_authenticated/2" do
    test "redirects if admin is authenticated", %{conn: conn, admin: admin} do
      conn =
        conn |> assign(:current_admin, admin) |> AdminAuth.redirect_if_admin_is_authenticated([])

      assert conn.halted
      assert redirected_to(conn) == "/"
    end

    test "does not redirect if admin is not authenticated", %{conn: conn} do
      conn = AdminAuth.redirect_if_admin_is_authenticated(conn, [])
      refute conn.halted
      refute conn.status
    end
  end

  describe "require_authenticated_admin/2" do
    test "redirects if admin is not authenticated", %{conn: conn} do
      conn = conn |> fetch_flash() |> AdminAuth.require_authenticated_admin([])
      assert conn.halted
      assert redirected_to(conn) == Routes.admin_session_path(conn, :new)
      assert get_flash(conn, :error) == "You must log in to access this page."
    end

    test "stores the path to redirect to on GET", %{conn: conn} do
      halted_conn =
        %{conn | path_info: ["foo"], query_string: ""}
        |> fetch_flash()
        |> AdminAuth.require_authenticated_admin([])

      assert halted_conn.halted
      assert get_session(halted_conn, :admin_return_to) == "/foo"

      halted_conn =
        %{conn | path_info: ["foo"], query_string: "bar=baz"}
        |> fetch_flash()
        |> AdminAuth.require_authenticated_admin([])

      assert halted_conn.halted
      assert get_session(halted_conn, :admin_return_to) == "/foo?bar=baz"

      halted_conn =
        %{conn | path_info: ["foo"], query_string: "bar", method: "POST"}
        |> fetch_flash()
        |> AdminAuth.require_authenticated_admin([])

      assert halted_conn.halted
      refute get_session(halted_conn, :admin_return_to)
    end

    test "does not redirect if admin is authenticated", %{conn: conn, admin: admin} do
      conn = conn |> assign(:current_admin, admin) |> AdminAuth.require_authenticated_admin([])
      refute conn.halted
      refute conn.status
    end
  end
end
