defmodule HeliosWeb.Admin.TrafficCamController do
  use HeliosWeb, :controller

  alias Helios.Widgets
  alias Helios.Widgets.TrafficCam

  plug(:put_root_layout, {HeliosWeb.LayoutView, "torch.html"})
  plug(:put_layout, false)

  def index(conn, params) do
    case Widgets.paginate_traffic_cams(params) do
      {:ok, assigns} ->
        render(conn, "index.html", assigns)

      error ->
        conn
        |> put_flash(:error, "There was an error rendering Traffic cams. #{inspect(error)}")
        |> redirect(to: Routes.admin_traffic_cam_path(conn, :index))
    end
  end

  def new(conn, _params) do
    changeset = Widgets.change_traffic_cam(%TrafficCam{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"traffic_cam" => traffic_cam_params}) do
    case Widgets.create_traffic_cam(traffic_cam_params) do
      {:ok, traffic_cam} ->
        conn
        |> put_flash(:info, "Traffic cam created successfully.")
        |> redirect(to: Routes.admin_traffic_cam_path(conn, :show, traffic_cam))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    traffic_cam = Widgets.get_traffic_cam!(id)
    render(conn, "show.html", traffic_cam: traffic_cam)
  end

  def edit(conn, %{"id" => id}) do
    traffic_cam = Widgets.get_traffic_cam!(id)
    changeset = Widgets.change_traffic_cam(traffic_cam)
    render(conn, "edit.html", traffic_cam: traffic_cam, changeset: changeset)
  end

  def update(conn, %{"id" => id, "traffic_cam" => traffic_cam_params}) do
    traffic_cam = Widgets.get_traffic_cam!(id)

    case Widgets.update_traffic_cam(traffic_cam, traffic_cam_params) do
      {:ok, traffic_cam} ->
        conn
        |> put_flash(:info, "Traffic cam updated successfully.")
        |> redirect(to: Routes.admin_traffic_cam_path(conn, :show, traffic_cam))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "edit.html", traffic_cam: traffic_cam, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    traffic_cam = Widgets.get_traffic_cam!(id)
    {:ok, _traffic_cam} = Widgets.delete_traffic_cam(traffic_cam)

    conn
    |> put_flash(:info, "Traffic cam deleted successfully.")
    |> redirect(to: Routes.admin_traffic_cam_path(conn, :index))
  end
end
