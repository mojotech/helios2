defmodule HeliosWeb.Admin.DailyEventSummaryController do
  use HeliosWeb, :controller

  alias Helios.Events
  alias Helios.Events.DailyEventSummary

  plug(:put_root_layout, {HeliosWeb.LayoutView, "torch.html"})
  plug(:put_layout, false)

  def index(conn, params) do
    case Events.paginate_daily_event_summaries(params) do
      {:ok, assigns} ->
        render(conn, "index.html", assigns)

      error ->
        conn
        |> put_flash(
          :error,
          "There was an error rendering Daily event summaries. #{inspect(error)}"
        )
        |> redirect(to: Routes.admin_daily_event_summary_path(conn, :index))
    end
  end

  def new(conn, _params) do
    changeset = Events.change_daily_event_summary(%DailyEventSummary{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"daily_event_summary" => daily_event_summary_params}) do
    case Events.create_daily_event_summary(daily_event_summary_params) do
      {:ok, daily_event_summary} ->
        conn
        |> put_flash(:info, "Daily event summary created successfully.")
        |> redirect(to: Routes.admin_daily_event_summary_path(conn, :show, daily_event_summary))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    daily_event_summary = Events.get_daily_event_summary!(id)
    render(conn, "show.html", daily_event_summary: daily_event_summary)
  end

  def edit(conn, %{"id" => id}) do
    daily_event_summary = Events.get_daily_event_summary!(id)
    changeset = Events.change_daily_event_summary(daily_event_summary)
    render(conn, "edit.html", daily_event_summary: daily_event_summary, changeset: changeset)
  end

  def update(conn, %{"id" => id, "daily_event_summary" => daily_event_summary_params}) do
    daily_event_summary = Events.get_daily_event_summary!(id)

    case Events.update_daily_event_summary(daily_event_summary, daily_event_summary_params) do
      {:ok, daily_event_summary} ->
        conn
        |> put_flash(:info, "Daily event summary updated successfully.")
        |> redirect(to: Routes.admin_daily_event_summary_path(conn, :show, daily_event_summary))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "edit.html", daily_event_summary: daily_event_summary, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    daily_event_summary = Events.get_daily_event_summary!(id)
    {:ok, _daily_event_summary} = Events.delete_daily_event_summary(daily_event_summary)

    conn
    |> put_flash(:info, "Daily event summary deleted successfully.")
    |> redirect(to: Routes.admin_daily_event_summary_path(conn, :index))
  end
end
