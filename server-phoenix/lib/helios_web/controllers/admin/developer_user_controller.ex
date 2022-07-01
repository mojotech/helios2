defmodule HeliosWeb.Admin.DeveloperUserController do
  use HeliosWeb, :controller

  alias Helios.Accounts
  alias Helios.Accounts.DeveloperUser

  plug(:put_root_layout, {HeliosWeb.LayoutView, "torch.html"})
  plug(:put_layout, false)

  def index(conn, params) do
    case Accounts.paginate_developer_users(params) do
      {:ok, assigns} ->
        render(conn, "index.html", assigns)

      error ->
        conn
        |> put_flash(:error, "There was an error rendering Developer users. #{inspect(error)}")
        |> redirect(to: Routes.admin_developer_user_path(conn, :index))
    end
  end

  def new(conn, _params) do
    changeset = Accounts.change_developer_user(%DeveloperUser{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"developer_user" => developer_user_params}) do
    case Accounts.create_developer_user(developer_user_params) do
      {:ok, developer_user} ->
        conn
        |> put_flash(:info, "Developer user created successfully.")
        |> redirect(to: Routes.admin_developer_user_path(conn, :show, developer_user))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    developer_user = Accounts.get_developer_user!(id)
    render(conn, "show.html", developer_user: developer_user)
  end

  def edit(conn, %{"id" => id}) do
    developer_user = Accounts.get_developer_user!(id)
    changeset = Accounts.change_developer_user(developer_user)
    render(conn, "edit.html", developer_user: developer_user, changeset: changeset)
  end

  def update(conn, %{"id" => id, "developer_user" => developer_user_params}) do
    developer_user = Accounts.get_developer_user!(id)

    case Accounts.update_developer_user(developer_user, developer_user_params) do
      {:ok, developer_user} ->
        conn
        |> put_flash(:info, "Developer user updated successfully.")
        |> redirect(to: Routes.admin_developer_user_path(conn, :show, developer_user))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "edit.html", developer_user: developer_user, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    developer_user = Accounts.get_developer_user!(id)
    {:ok, _developer_user} = Accounts.delete_developer_user(developer_user)

    conn
    |> put_flash(:info, "Developer user deleted successfully.")
    |> redirect(to: Routes.admin_developer_user_path(conn, :index))
  end
end
