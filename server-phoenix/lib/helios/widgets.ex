defmodule Helios.Widgets do
  @moduledoc """
  The Widgets context.
  """

  import Ecto.Query, warn: false
  alias Helios.Repo
  import Torch.Helpers, only: [sort: 1, paginate: 4, strip_unset_booleans: 3]
  import Filtrex.Type.Config

  alias Helios.Widgets.Widget

  @pagination [page_size: 15]
  @pagination_distance 5

  @doc """
  Paginate the list of widgets using filtrex
  filters.

  ## Examples

      iex> paginate_widgets(%{})
      %{widgets: [%Widget{}], ...}

  """
  @spec paginate_widgets(map) :: {:ok, map} | {:error, any}
  def paginate_widgets(params \\ %{}) do
    params =
      params
      #      |> strip_unset_booleans("widget", [:show_weather:enabled])
      |> Map.put_new("sort_direction", "desc")
      |> Map.put_new("sort_field", "inserted_at")

    {:ok, sort_direction} = Map.fetch(params, "sort_direction")
    {:ok, sort_field} = Map.fetch(params, "sort_field")

    with {:ok, filter} <- Filtrex.parse_params(filter_config(:widgets), params["widget"] || %{}),
         %Scrivener.Page{} = page <- do_paginate_widgets(filter, params) do
      {:ok,
       %{
         widgets: page.entries,
         page_number: page.page_number,
         page_size: page.page_size,
         total_pages: page.total_pages,
         total_entries: page.total_entries,
         distance: @pagination_distance,
         sort_field: sort_field,
         sort_direction: sort_direction
       }}
    else
      {:error, error} -> {:error, error}
      error -> {:error, error}
    end
  end

  defp do_paginate_widgets(filter, params) do
    Widget
    |> Filtrex.query(filter)
    |> order_by(^sort(params))
    |> paginate(Repo, params, @pagination)
  end

  @doc """
  Returns the list of widgets.

  ## Examples

      iex> list_widgets()
      [%Widget{}, ...]

  """
  def list_widgets do
    Repo.all(Widget)
  end

  @doc """
  Gets a single widget.

  Raises `Ecto.NoResultsError` if the Widget does not exist.

  ## Examples

      iex> get_widget!(123)
      %Widget{}

      iex> get_widget!(456)
      ** (Ecto.NoResultsError)

  """
  def get_widget!(id), do: Repo.get!(Widget, id)

  @doc """
  Creates a widget.

  ## Examples

      iex> create_widget(%{field: value})
      {:ok, %Widget{}}

      iex> create_widget(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_widget(attrs \\ %{}) do
    %Widget{}
    |> Widget.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a widget.

  ## Examples

      iex> update_widget(widget, %{field: new_value})
      {:ok, %Widget{}}

      iex> update_widget(widget, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_widget(%Widget{} = widget, attrs) do
    widget
    |> Widget.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Widget.

  ## Examples

      iex> delete_widget(widget)
      {:ok, %Widget{}}

      iex> delete_widget(widget)
      {:error, %Ecto.Changeset{}}

  """
  def delete_widget(%Widget{} = widget) do
    Repo.delete(widget)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking widget changes.

  ## Examples

      iex> change_widget(widget)
      %Ecto.Changeset{source: %Widget{}}

  """
  def change_widget(%Widget{} = widget, attrs \\ %{}) do
    Widget.changeset(widget, attrs)
  end

  import Torch.Helpers, only: [sort: 1, paginate: 4, strip_unset_booleans: 3]
  import Filtrex.Type.Config

  alias Helios.Widgets.TrafficCam

  @pagination [page_size: 15]
  @pagination_distance 5

  @doc """
  Paginate the list of traffic_cams using filtrex
  filters.

  ## Examples

      iex> paginate_traffic_cams(%{})
      %{traffic_cams: [%TrafficCam{}], ...}

  """
  @spec paginate_traffic_cams(map) :: {:ok, map} | {:error, any}
  def paginate_traffic_cams(params \\ %{}) do
    params =
      params
      |> strip_unset_booleans("traffic_cam", [])
      |> Map.put_new("sort_direction", "desc")
      |> Map.put_new("sort_field", "inserted_at")

    {:ok, sort_direction} = Map.fetch(params, "sort_direction")
    {:ok, sort_field} = Map.fetch(params, "sort_field")

    with {:ok, filter} <-
           Filtrex.parse_params(filter_config(:traffic_cams), params["traffic_cam"] || %{}),
         %Scrivener.Page{} = page <- do_paginate_traffic_cams(filter, params) do
      {:ok,
       %{
         traffic_cams: page.entries,
         page_number: page.page_number,
         page_size: page.page_size,
         total_pages: page.total_pages,
         total_entries: page.total_entries,
         distance: @pagination_distance,
         sort_field: sort_field,
         sort_direction: sort_direction
       }}
    else
      {:error, error} -> {:error, error}
      error -> {:error, error}
    end
  end

  defp do_paginate_traffic_cams(filter, params) do
    TrafficCam
    |> Filtrex.query(filter)
    |> order_by(^sort(params))
    |> paginate(Repo, params, @pagination)
  end

  @doc """
  Returns the list of traffic_cams.

  ## Examples

      iex> list_traffic_cams()
      [%TrafficCam{}, ...]

  """
  def list_traffic_cams do
    Repo.all(TrafficCam)
  end

  @doc """
  Gets a single traffic_cam.

  Raises `Ecto.NoResultsError` if the Traffic cam does not exist.

  ## Examples

      iex> get_traffic_cam!(123)
      %TrafficCam{}

      iex> get_traffic_cam!(456)
      ** (Ecto.NoResultsError)

  """
  def get_traffic_cam!(id), do: Repo.get!(TrafficCam, id)

  @doc """
  Creates a traffic_cam.

  ## Examples

      iex> create_traffic_cam(%{field: value})
      {:ok, %TrafficCam{}}

      iex> create_traffic_cam(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_traffic_cam(attrs \\ %{}) do
    %TrafficCam{}
    |> TrafficCam.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a traffic_cam.

  ## Examples

      iex> update_traffic_cam(traffic_cam, %{field: new_value})
      {:ok, %TrafficCam{}}

      iex> update_traffic_cam(traffic_cam, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_traffic_cam(%TrafficCam{} = traffic_cam, attrs) do
    traffic_cam
    |> TrafficCam.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a TrafficCam.

  ## Examples

      iex> delete_traffic_cam(traffic_cam)
      {:ok, %TrafficCam{}}

      iex> delete_traffic_cam(traffic_cam)
      {:error, %Ecto.Changeset{}}

  """
  def delete_traffic_cam(%TrafficCam{} = traffic_cam) do
    Repo.delete(traffic_cam)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking traffic_cam changes.

  ## Examples

      iex> change_traffic_cam(traffic_cam)
      %Ecto.Changeset{source: %TrafficCam{}}

  """
  def change_traffic_cam(%TrafficCam{} = traffic_cam, attrs \\ %{}) do
    TrafficCam.changeset(traffic_cam, attrs)
  end

  defp filter_config(:traffic_cams) do
    defconfig do
      text(:title)
      text(:url)
      text(:feed_format)
    end
  end

  defp filter_config(:widgets) do
    defconfig do
      text(:name)
      boolean(:enabled)
      number(:duration_seconds)
      number(:position)
      text(:sidebar_text)
      boolean(:show_weather)
    end
  end
end
