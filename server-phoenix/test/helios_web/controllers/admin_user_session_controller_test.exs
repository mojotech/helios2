defmodule HeliosWeb.AdminUserSessionControllerTest do
  use HeliosWeb.ConnCase

  import Helios.AccountsFixtures

  setup do
    %{admin_user: admin_user_fixture()}
  end

  describe "GET /admin_users/log_in" do
    test "renders log in page", %{conn: conn} do
      conn = get(conn, Routes.admin_user_session_path(conn, :new))
      response = html_response(conn, 200)
      assert response =~ "<h1>Log in</h1>"
    end

    test "redirects if already logged in", %{conn: conn, admin_user: admin_user} do
      conn =
        conn |> log_in_admin_user(admin_user) |> get(Routes.admin_user_session_path(conn, :new))

      assert redirected_to(conn) == "/admin"
    end
  end

  describe "POST /admin_users/log_in" do
    test "logs the admin_user in", %{conn: conn, admin_user: admin_user} do
      conn =
        post(conn, Routes.admin_user_session_path(conn, :create), %{
          "admin_user" => %{
            "email" => admin_user.email,
            "password" => valid_admin_user_password()
          }
        })

      assert get_session(conn, :admin_user_token)
      assert redirected_to(conn) == "/admin"

      # Now do a logged in request and assert on the menu
      # Kaffy will redrect to "/admin/dashboard"
      conn = get(conn, "/admin")
      response = html_response(conn, 302)
      assert response =~ "/admin/dashboard"
    end

    test "logs the admin_user in with remember me", %{conn: conn, admin_user: admin_user} do
      conn =
        post(conn, Routes.admin_user_session_path(conn, :create), %{
          "admin_user" => %{
            "email" => admin_user.email,
            "password" => valid_admin_user_password(),
            "remember_me" => "true"
          }
        })

      assert conn.resp_cookies["_helios_web_admin_user_remember_me"]
      assert redirected_to(conn) == "/admin"
    end

    test "logs the admin_user in with return to", %{conn: conn, admin_user: admin_user} do
      conn =
        conn
        |> init_test_session(admin_user_return_to: "/foo/bar")
        |> post(Routes.admin_user_session_path(conn, :create), %{
          "admin_user" => %{
            "email" => admin_user.email,
            "password" => valid_admin_user_password()
          }
        })

      assert redirected_to(conn) == "/foo/bar"
    end

    test "emits error message with invalid credentials", %{conn: conn, admin_user: admin_user} do
      conn =
        post(conn, Routes.admin_user_session_path(conn, :create), %{
          "admin_user" => %{"email" => admin_user.email, "password" => "invalid_password"}
        })

      response = html_response(conn, 200)
      assert response =~ "<h1>Log in</h1>"
      assert response =~ "Invalid email or password"
    end
  end

  describe "DELETE /admin_users/log_out" do
    test "logs the admin_user out", %{conn: conn, admin_user: admin_user} do
      conn =
        conn
        |> log_in_admin_user(admin_user)
        |> delete(Routes.admin_user_session_path(conn, :delete))

      assert redirected_to(conn) == "/admin"
      refute get_session(conn, :admin_user_token)
      assert get_flash(conn, :info) =~ "Logged out successfully"
    end

    test "succeeds even if the admin_user is not logged in", %{conn: conn} do
      conn = delete(conn, Routes.admin_user_session_path(conn, :delete))
      assert redirected_to(conn) == "/admin"
      refute get_session(conn, :admin_user_token)
      assert get_flash(conn, :info) =~ "Logged out successfully"
    end
  end
end
