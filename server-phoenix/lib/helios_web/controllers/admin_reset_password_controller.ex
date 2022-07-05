defmodule HeliosWeb.AdminResetPasswordController do
  use HeliosWeb, :controller

  alias Helios.Accounts

  plug :get_admin_by_reset_password_token when action in [:edit, :update]

  def new(conn, _params) do
    render(conn, "new.html")
  end

  def create(conn, %{"admin" => %{"email" => email}}) do
    if admin = Accounts.get_admin_by_email(email) do
      Accounts.deliver_admin_reset_password_instructions(
        admin,
        &Routes.admin_reset_password_url(conn, :edit, &1)
      )
    end

    conn
    |> put_flash(
      :info,
      "If your email is in our system, you will receive instructions to reset your password shortly."
    )
    |> redirect(to: "/")
  end

  def edit(conn, _params) do
    render(conn, "edit.html", changeset: Accounts.change_admin_password(conn.assigns.admin))
  end

  # Do not log in the admin after reset password to avoid a
  # leaked token giving the admin access to the account.
  def update(conn, %{"admin" => admin_params}) do
    case Accounts.reset_admin_password(conn.assigns.admin, admin_params) do
      {:ok, _} ->
        conn
        |> put_flash(:info, "Password reset successfully.")
        |> redirect(to: Routes.admin_session_path(conn, :new))

      {:error, changeset} ->
        render(conn, "edit.html", changeset: changeset)
    end
  end

  defp get_admin_by_reset_password_token(conn, _opts) do
    %{"token" => token} = conn.params

    if admin = Accounts.get_admin_by_reset_password_token(token) do
      conn |> assign(:admin, admin) |> assign(:token, token)
    else
      conn
      |> put_flash(:error, "Reset password link is invalid or it has expired.")
      |> redirect(to: "/")
      |> halt()
    end
  end
end
