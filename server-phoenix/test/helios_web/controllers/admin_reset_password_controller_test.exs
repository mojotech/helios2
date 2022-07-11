defmodule HeliosWeb.AdminResetPasswordControllerTest do
  use HeliosWeb.ConnCase, async: true

  alias Helios.Accounts
  alias Helios.Repo
  import Helios.AccountsFixtures

  setup do
    %{admin: admin_fixture()}
  end

  describe "GET /admins/reset_password" do
    test "renders the reset password page", %{conn: conn} do
      conn = get(conn, Routes.admin_reset_password_path(conn, :new))
      response = html_response(conn, 200)
      assert response =~ "<h1>Forgot your password?</h1>"
    end
  end

  describe "POST /admins/reset_password" do
    @tag :capture_log
    test "sends a new reset password token", %{conn: conn, admin: admin} do
      conn =
        post(conn, Routes.admin_reset_password_path(conn, :create), %{
          "admin" => %{"email" => admin.email}
        })

      assert redirected_to(conn) == "/"
      assert get_flash(conn, :info) =~ "If your email is in our system"
      assert Repo.get_by!(Accounts.AdminToken, admin_id: admin.id).context == "reset_password"
    end

    test "does not send reset password token if email is invalid", %{conn: conn} do
      conn =
        post(conn, Routes.admin_reset_password_path(conn, :create), %{
          "admin" => %{"email" => "unknown@example.com"}
        })

      assert redirected_to(conn) == "/"
      assert get_flash(conn, :info) =~ "If your email is in our system"
      assert Repo.all(Accounts.AdminToken) == []
    end
  end

  describe "GET /admins/reset_password/:token" do
    setup %{admin: admin} do
      token =
        extract_admin_token(fn url ->
          Accounts.deliver_admin_reset_password_instructions(admin, url)
        end)

      %{token: token}
    end

    test "renders reset password", %{conn: conn, token: token} do
      conn = get(conn, Routes.admin_reset_password_path(conn, :edit, token))
      assert html_response(conn, 200) =~ "<h1>Reset password</h1>"
    end

    test "does not render reset password with invalid token", %{conn: conn} do
      conn = get(conn, Routes.admin_reset_password_path(conn, :edit, "oops"))
      assert redirected_to(conn) == "/"
      assert get_flash(conn, :error) =~ "Reset password link is invalid or it has expired"
    end
  end

  describe "PUT /admins/reset_password/:token" do
    setup %{admin: admin} do
      token =
        extract_admin_token(fn url ->
          Accounts.deliver_admin_reset_password_instructions(admin, url)
        end)

      %{token: token}
    end

    test "resets password once", %{conn: conn, admin: admin, token: token} do
      conn =
        put(conn, Routes.admin_reset_password_path(conn, :update, token), %{
          "admin" => %{
            "password" => "new valid password",
            "password_confirmation" => "new valid password"
          }
        })

      assert redirected_to(conn) == Routes.admin_session_path(conn, :new)
      refute get_session(conn, :admin_token)
      assert get_flash(conn, :info) =~ "Password reset successfully"
      assert Accounts.get_admin_by_email_and_password(admin.email, "new valid password")
    end

    test "does not reset password on invalid data", %{conn: conn, token: token} do
      conn =
        put(conn, Routes.admin_reset_password_path(conn, :update, token), %{
          "admin" => %{
            "password" => "too short",
            "password_confirmation" => "does not match"
          }
        })

      response = html_response(conn, 200)
      assert response =~ "<h1>Reset password</h1>"
      assert response =~ "should be at least 12 character(s)"
      assert response =~ "does not match password"
    end

    test "does not reset password with invalid token", %{conn: conn} do
      conn = put(conn, Routes.admin_reset_password_path(conn, :update, "oops"))
      assert redirected_to(conn) == "/"
      assert get_flash(conn, :error) =~ "Reset password link is invalid or it has expired"
    end
  end
end
