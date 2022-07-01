defmodule HeliosWeb.Admin.AnnouncementController do
  use HeliosWeb, :controller

  alias Helios.Events
  alias Helios.Events.Announcement

  plug(:put_root_layout, {HeliosWeb.LayoutView, "torch.html"})
  plug(:put_layout, false)

  def index(conn, params) do
    case Events.paginate_announcements(params) do
      {:ok, assigns} ->
        render(conn, "index.html", assigns)

      error ->
        conn
        |> put_flash(:error, "There was an error rendering Announcements. #{inspect(error)}")
        |> redirect(to: Routes.admin_announcement_path(conn, :index))
    end
  end

  def new(conn, _params) do
    changeset = Events.change_announcement(%Announcement{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"announcement" => announcement_params}) do
    case Events.create_announcement(announcement_params) do
      {:ok, announcement} ->
        conn
        |> put_flash(:info, "Announcement created successfully.")
        |> redirect(to: Routes.admin_announcement_path(conn, :show, announcement))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    announcement = Events.get_announcement!(id)
    render(conn, "show.html", announcement: announcement)
  end

  def edit(conn, %{"id" => id}) do
    announcement = Events.get_announcement!(id)
    changeset = Events.change_announcement(announcement)
    render(conn, "edit.html", announcement: announcement, changeset: changeset)
  end

  def update(conn, %{"id" => id, "announcement" => announcement_params}) do
    announcement = Events.get_announcement!(id)

    case Events.update_announcement(announcement, announcement_params) do
      {:ok, announcement} ->
        conn
        |> put_flash(:info, "Announcement updated successfully.")
        |> redirect(to: Routes.admin_announcement_path(conn, :show, announcement))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "edit.html", announcement: announcement, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    announcement = Events.get_announcement!(id)
    {:ok, _announcement} = Events.delete_announcement(announcement)

    conn
    |> put_flash(:info, "Announcement deleted successfully.")
    |> redirect(to: Routes.admin_announcement_path(conn, :index))
  end
end
