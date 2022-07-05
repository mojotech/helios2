defmodule HeliosWeb.AdminConfirmationController do
  use HeliosWeb, :controller

  alias Helios.Accounts

  def new(conn, _params) do
    render(conn, "new.html")
  end

  def create(conn, %{"admin" => %{"email" => email}}) do
    if admin = Accounts.get_admin_by_email(email) do
      Accounts.deliver_admin_confirmation_instructions(
        admin,
        &Routes.admin_confirmation_url(conn, :edit, &1)
      )
    end

    conn
    |> put_flash(
      :info,
      "If your email is in our system and it has not been confirmed yet, " <>
        "you will receive an email with instructions shortly."
    )
    |> redirect(to: "/")
  end

  def edit(conn, %{"token" => token}) do
    render(conn, "edit.html", token: token)
  end

  # Do not log in the admin after confirmation to avoid a
  # leaked token giving the admin access to the account.
  def update(conn, %{"token" => token}) do
    case Accounts.confirm_admin(token) do
      {:ok, _} ->
        conn
        |> put_flash(:info, "Admin confirmed successfully.")
        |> redirect(to: "/")

      :error ->
        # If there is a current admin and the account was already confirmed,
        # then odds are that the confirmation link was already visited, either
        # by some automation or by the admin themselves, so we redirect without
        # a warning message.
        case conn.assigns do
          %{current_admin: %{confirmed_at: confirmed_at}} when not is_nil(confirmed_at) ->
            redirect(conn, to: "/")

          %{} ->
            conn
            |> put_flash(:error, "Admin confirmation link is invalid or it has expired.")
            |> redirect(to: "/")
        end
    end
  end
end
