defmodule HeliosWeb.AdminUserSessionController do
  use HeliosWeb, :controller

  alias Helios.Accounts
  alias HeliosWeb.AdminUserAuth

  def new(conn, _params) do
    render(conn, "new.html", error_message: nil)
  end

  def create(conn, %{"admin_user" => admin_user_params}) do
    %{"email" => email, "password" => password} = admin_user_params

    if admin_user = Accounts.get_admin_user_by_email_and_password(email, password) do
      AdminUserAuth.log_in_admin_user(conn, admin_user, admin_user_params)
    else
      # In order to prevent user enumeration attacks, don't disclose whether the email is registered.
      render(conn, "new.html", error_message: "Invalid email or password")
    end
  end

  def delete(conn, _params) do
    conn
    |> put_flash(:info, "Logged out successfully.")
    |> AdminUserAuth.log_out_admin_user()
  end
end
