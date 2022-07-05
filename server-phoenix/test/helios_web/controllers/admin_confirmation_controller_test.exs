defmodule HeliosWeb.AdminConfirmationControllerTest do
  use HeliosWeb.ConnCase, async: true

  alias Helios.Accounts
  alias Helios.Repo
  import Helios.AccountsFixtures

  setup do
    %{admin: admin_fixture()}
  end

  describe "GET /admins/confirm" do
    test "renders the resend confirmation page", %{conn: conn} do
      conn = get(conn, Routes.admin_confirmation_path(conn, :new))
      response = html_response(conn, 200)
      assert response =~ "<h1>Resend confirmation instructions</h1>"
    end
  end

  describe "POST /admins/confirm" do
    @tag :capture_log
    test "sends a new confirmation token", %{conn: conn, admin: admin} do
      conn =
        post(conn, Routes.admin_confirmation_path(conn, :create), %{
          "admin" => %{"email" => admin.email}
        })

      assert redirected_to(conn) == "/"
      assert get_flash(conn, :info) =~ "If your email is in our system"
      assert Repo.get_by!(Accounts.AdminToken, admin_id: admin.id).context == "confirm"
    end

    test "does not send confirmation token if Admin is confirmed", %{conn: conn, admin: admin} do
      Repo.update!(Accounts.Admin.confirm_changeset(admin))

      conn =
        post(conn, Routes.admin_confirmation_path(conn, :create), %{
          "admin" => %{"email" => admin.email}
        })

      assert redirected_to(conn) == "/"
      assert get_flash(conn, :info) =~ "If your email is in our system"
      refute Repo.get_by(Accounts.AdminToken, admin_id: admin.id)
    end

    test "does not send confirmation token if email is invalid", %{conn: conn} do
      conn =
        post(conn, Routes.admin_confirmation_path(conn, :create), %{
          "admin" => %{"email" => "unknown@example.com"}
        })

      assert redirected_to(conn) == "/"
      assert get_flash(conn, :info) =~ "If your email is in our system"
      assert Repo.all(Accounts.AdminToken) == []
    end
  end

  describe "GET /admins/confirm/:token" do
    test "renders the confirmation page", %{conn: conn} do
      conn = get(conn, Routes.admin_confirmation_path(conn, :edit, "some-token"))
      response = html_response(conn, 200)
      assert response =~ "<h1>Confirm account</h1>"

      form_action = Routes.admin_confirmation_path(conn, :update, "some-token")
      assert response =~ "action=\"#{form_action}\""
    end
  end

  describe "POST /admins/confirm/:token" do
    test "confirms the given token once", %{conn: conn, admin: admin} do
      token =
        extract_admin_token(fn url ->
          Accounts.deliver_admin_confirmation_instructions(admin, url)
        end)

      conn = post(conn, Routes.admin_confirmation_path(conn, :update, token))
      assert redirected_to(conn) == "/"
      assert get_flash(conn, :info) =~ "Admin confirmed successfully"
      assert Accounts.get_admin!(admin.id).confirmed_at
      refute get_session(conn, :admin_token)
      assert Repo.all(Accounts.AdminToken) == []

      # When not logged in
      conn = post(conn, Routes.admin_confirmation_path(conn, :update, token))
      assert redirected_to(conn) == "/"
      assert get_flash(conn, :error) =~ "Admin confirmation link is invalid or it has expired"

      # When logged in
      conn =
        build_conn()
        |> log_in_admin(admin)
        |> post(Routes.admin_confirmation_path(conn, :update, token))

      assert redirected_to(conn) == "/"
      refute get_flash(conn, :error)
    end

    test "does not confirm email with invalid token", %{conn: conn, admin: admin} do
      conn = post(conn, Routes.admin_confirmation_path(conn, :update, "oops"))
      assert redirected_to(conn) == "/"
      assert get_flash(conn, :error) =~ "Admin confirmation link is invalid or it has expired"
      refute Accounts.get_admin!(admin.id).confirmed_at
    end
  end
end
