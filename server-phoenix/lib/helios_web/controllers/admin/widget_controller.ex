defmodule HeliosWeb.Admin.WidgetController do
  use HeliosWeb, :controller

  alias Helios.Widgets
  alias Helios.Widgets.Widget

  plug(:put_root_layout, {HeliosWeb.LayoutView, "torch.html"})
  plug(:put_layout, false)

  def index(conn, params) do
    case Widgets.paginate_widgets(params) do
      {:ok, assigns} ->
        render(conn, "index.html", assigns)

      error ->
        conn
        |> put_flash(:error, "There was an error rendering Widgets. #{inspect(error)}")
        |> redirect(to: Routes.admin_widget_path(conn, :index))
    end
  end

  def new(conn, _params) do
    changeset = Widgets.change_widget(%Widget{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"widget" => widget_params}) do
    case Widgets.create_widget(widget_params) do
      {:ok, widget} ->
        conn
        |> put_flash(:info, "Widget created successfully.")
        |> redirect(to: Routes.admin_widget_path(conn, :show, widget))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    widget = Widgets.get_widget!(id)
    render(conn, "show.html", widget: widget)
  end

  def edit(conn, %{"id" => id}) do
    widget = Widgets.get_widget!(id)
    changeset = Widgets.change_widget(widget)
    render(conn, "edit.html", widget: widget, changeset: changeset)
  end

  def update(conn, %{"id" => id, "widget" => widget_params}) do
    widget = Widgets.get_widget!(id)

    case Widgets.update_widget(widget, widget_params) do
      {:ok, widget} ->
        conn
        |> put_flash(:info, "Widget updated successfully.")
        |> redirect(to: Routes.admin_widget_path(conn, :show, widget))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "edit.html", widget: widget, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    widget = Widgets.get_widget!(id)
    {:ok, _widget} = Widgets.delete_widget(widget)

    conn
    |> put_flash(:info, "Widget deleted successfully.")
    |> redirect(to: Routes.admin_widget_path(conn, :index))
  end
end
