defmodule HeliosWeb.AdminSettingsController do
  use HeliosWeb, :controller

  alias Helios.Accounts
  alias HeliosWeb.AdminAuth

  plug :assign_email_and_password_changesets

  def edit(conn, _params) do
    render(conn, "edit.html")
  end

  def update(conn, %{"action" => "update_email"} = params) do
    %{"current_password" => password, "admin" => admin_params} = params
    admin = conn.assigns.current_admin

    case Accounts.apply_admin_email(admin, password, admin_params) do
      {:ok, applied_admin} ->
        Accounts.deliver_update_email_instructions(
          applied_admin,
          admin.email,
          &Routes.admin_settings_url(conn, :confirm_email, &1)
        )

        conn
        |> put_flash(
          :info,
          "A link to confirm your email change has been sent to the new address."
        )
        |> redirect(to: Routes.admin_settings_path(conn, :edit))

      {:error, changeset} ->
        render(conn, "edit.html", email_changeset: changeset)
    end
  end

  def update(conn, %{"action" => "update_password"} = params) do
    %{"current_password" => password, "admin" => admin_params} = params
    admin = conn.assigns.current_admin

    case Accounts.update_admin_password(admin, password, admin_params) do
      {:ok, admin} ->
        conn
        |> put_flash(:info, "Password updated successfully.")
        |> put_session(:admin_return_to, Routes.admin_settings_path(conn, :edit))
        |> AdminAuth.log_in_admin(admin)

      {:error, changeset} ->
        render(conn, "edit.html", password_changeset: changeset)
    end
  end

  def confirm_email(conn, %{"token" => token}) do
    case Accounts.update_admin_email(conn.assigns.current_admin, token) do
      :ok ->
        conn
        |> put_flash(:info, "Email changed successfully.")
        |> redirect(to: Routes.admin_settings_path(conn, :edit))

      :error ->
        conn
        |> put_flash(:error, "Email change link is invalid or it has expired.")
        |> redirect(to: Routes.admin_settings_path(conn, :edit))
    end
  end

  defp assign_email_and_password_changesets(conn, _opts) do
    admin = conn.assigns.current_admin

    conn
    |> assign(:email_changeset, Accounts.change_admin_email(admin))
    |> assign(:password_changeset, Accounts.change_admin_password(admin))
  end
end
