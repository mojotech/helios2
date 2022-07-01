defmodule Helios.Events do
  @moduledoc """
  The Events context.
  """

  import Ecto.Query, warn: false
  alias Helios.Repo

  alias Helios.Events.Event

  import Torch.Helpers, only: [sort: 1, paginate: 4, strip_unset_booleans: 3]
  import Filtrex.Type.Config

  alias Helios.Events.Event

  @pagination [page_size: 15]
  @pagination_distance 5

  @doc """
  Paginate the list of events using filtrex
  filters.

  ## Examples

      iex> paginate_events(%{})
      %{events: [%Event{}], ...}

  """
  @spec paginate_events(map) :: {:ok, map} | {:error, any}
  def paginate_events(params \\ %{}) do
    params =
      params
      |> strip_unset_booleans("event", [])
      |> Map.put_new("sort_direction", "desc")
      |> Map.put_new("sort_field", "inserted_at")

    {:ok, sort_direction} = Map.fetch(params, "sort_direction")
    {:ok, sort_field} = Map.fetch(params, "sort_field")

    with {:ok, filter} <- Filtrex.parse_params(filter_config(:events), params["event"] || %{}),
         %Scrivener.Page{} = page <- do_paginate_events(filter, params) do
      {:ok,
       %{
         events: page.entries,
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

  defp do_paginate_events(filter, params) do
    Event
    |> Filtrex.query(filter)
    |> order_by(^sort(params))
    |> paginate(Repo, params, @pagination)
  end

  @doc """
  Returns the list of events.

  ## Examples

      iex> list_events()
      [%Event{}, ...]

  """
  def list_events do
    Repo.all(Event)
  end

  @doc """
  Gets a single event.

  Raises `Ecto.NoResultsError` if the Event does not exist.

  ## Examples

      iex> get_event!(123)
      %Event{}

      iex> get_event!(456)
      ** (Ecto.NoResultsError)

  """
  def get_event!(id), do: Repo.get!(Event, id)

  @doc """
  Creates a event.

  ## Examples

      iex> create_event(%{field: value})
      {:ok, %Event{}}

      iex> create_event(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_event(attrs \\ %{}) do
    %Event{}
    |> Event.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a event.

  ## Examples

      iex> update_event(event, %{field: new_value})
      {:ok, %Event{}}

      iex> update_event(event, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_event(%Event{} = event, attrs) do
    event
    |> Event.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a event.

  ## Examples

      iex> delete_event(event)
      {:ok, %Event{}}

      iex> delete_event(event)
      {:error, %Ecto.Changeset{}}

  """
  def delete_event(%Event{} = event) do
    Repo.delete(event)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking event changes.

  ## Examples

      iex> change_event(event)
      %Ecto.Changeset{data: %Event{}}

  """
  def change_event(%Event{} = event, attrs \\ %{}) do
    Event.changeset(event, attrs)
  end

  import Torch.Helpers, only: [sort: 1, paginate: 4, strip_unset_booleans: 3]
  import Filtrex.Type.Config

  alias Helios.Events.DailyEventSummary

  @pagination [page_size: 15]
  @pagination_distance 5

  @doc """
  Paginate the list of daily_event_summaries using filtrex
  filters.

  ## Examples

      iex> paginate_daily_event_summaries(%{})
      %{daily_event_summaries: [%DailyEventSummary{}], ...}

  """
  @spec paginate_daily_event_summaries(map) :: {:ok, map} | {:error, any}
  def paginate_daily_event_summaries(params \\ %{}) do
    params =
      params
      |> strip_unset_booleans("daily_event_summary", [])
      |> Map.put_new("sort_direction", "desc")
      |> Map.put_new("sort_field", "inserted_at")

    {:ok, sort_direction} = Map.fetch(params, "sort_direction")
    {:ok, sort_field} = Map.fetch(params, "sort_field")

    with {:ok, filter} <-
           Filtrex.parse_params(
             filter_config(:daily_event_summaries),
             params["daily_event_summary"] || %{}
           ),
         %Scrivener.Page{} = page <- do_paginate_daily_event_summaries(filter, params) do
      {:ok,
       %{
         daily_event_summaries: page.entries,
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

  defp do_paginate_daily_event_summaries(filter, params) do
    DailyEventSummary
    |> Filtrex.query(filter)
    |> order_by(^sort(params))
    |> paginate(Repo, params, @pagination)
  end

  @doc """
  Returns the list of daily_event_summaries.

  ## Examples

      iex> list_daily_event_summaries()
      [%DailyEventSummary{}, ...]

  """
  def list_daily_event_summaries do
    Repo.all(DailyEventSummary)
  end

  @doc """
  Gets a single daily_event_summary.

  Raises `Ecto.NoResultsError` if the Daily event summary does not exist.

  ## Examples

      iex> get_daily_event_summary!(123)
      %DailyEventSummary{}

      iex> get_daily_event_summary!(456)
      ** (Ecto.NoResultsError)

  """
  def get_daily_event_summary!(id), do: Repo.get!(DailyEventSummary, id)

  @doc """
  Creates a daily_event_summary.

  ## Examples

      iex> create_daily_event_summary(%{field: value})
      {:ok, %DailyEventSummary{}}

      iex> create_daily_event_summary(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_daily_event_summary(attrs \\ %{}) do
    %DailyEventSummary{}
    |> DailyEventSummary.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a daily_event_summary.

  ## Examples

      iex> update_daily_event_summary(daily_event_summary, %{field: new_value})
      {:ok, %DailyEventSummary{}}

      iex> update_daily_event_summary(daily_event_summary, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_daily_event_summary(%DailyEventSummary{} = daily_event_summary, attrs) do
    daily_event_summary
    |> DailyEventSummary.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a DailyEventSummary.

  ## Examples

      iex> delete_daily_event_summary(daily_event_summary)
      {:ok, %DailyEventSummary{}}

      iex> delete_daily_event_summary(daily_event_summary)
      {:error, %Ecto.Changeset{}}

  """
  def delete_daily_event_summary(%DailyEventSummary{} = daily_event_summary) do
    Repo.delete(daily_event_summary)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking daily_event_summary changes.

  ## Examples

      iex> change_daily_event_summary(daily_event_summary)
      %Ecto.Changeset{source: %DailyEventSummary{}}

  """
  def change_daily_event_summary(%DailyEventSummary{} = daily_event_summary, attrs \\ %{}) do
    DailyEventSummary.changeset(daily_event_summary, attrs)
  end

  import Torch.Helpers, only: [sort: 1, paginate: 4, strip_unset_booleans: 3]
  import Filtrex.Type.Config

  alias Helios.Events.Announcement

  @pagination [page_size: 15]
  @pagination_distance 5

  @doc """
  Paginate the list of announcements using filtrex
  filters.

  ## Examples

      iex> paginate_announcements(%{})
      %{announcements: [%Announcement{}], ...}

  """
  @spec paginate_announcements(map) :: {:ok, map} | {:error, any}
  def paginate_announcements(params \\ %{}) do
    params =
      params
      |> strip_unset_booleans("announcement", [])
      |> Map.put_new("sort_direction", "desc")
      |> Map.put_new("sort_field", "inserted_at")

    {:ok, sort_direction} = Map.fetch(params, "sort_direction")
    {:ok, sort_field} = Map.fetch(params, "sort_field")

    with {:ok, filter} <-
           Filtrex.parse_params(filter_config(:announcements), params["announcement"] || %{}),
         %Scrivener.Page{} = page <- do_paginate_announcements(filter, params) do
      {:ok,
       %{
         announcements: page.entries,
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

  defp do_paginate_announcements(filter, params) do
    Announcement
    |> Filtrex.query(filter)
    |> order_by(^sort(params))
    |> paginate(Repo, params, @pagination)
  end

  @doc """
  Returns the list of announcements.

  ## Examples

      iex> list_announcements()
      [%Announcement{}, ...]

  """
  def list_announcements do
    Repo.all(Announcement)
  end

  @doc """
  Gets a single announcement.

  Raises `Ecto.NoResultsError` if the Announcement does not exist.

  ## Examples

      iex> get_announcement!(123)
      %Announcement{}

      iex> get_announcement!(456)
      ** (Ecto.NoResultsError)

  """
  def get_announcement!(id), do: Repo.get!(Announcement, id)

  @doc """
  Creates a announcement.

  ## Examples

      iex> create_announcement(%{field: value})
      {:ok, %Announcement{}}

      iex> create_announcement(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_announcement(attrs \\ %{}) do
    %Announcement{}
    |> Announcement.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a announcement.

  ## Examples

      iex> update_announcement(announcement, %{field: new_value})
      {:ok, %Announcement{}}

      iex> update_announcement(announcement, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_announcement(%Announcement{} = announcement, attrs) do
    announcement
    |> Announcement.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Announcement.

  ## Examples

      iex> delete_announcement(announcement)
      {:ok, %Announcement{}}

      iex> delete_announcement(announcement)
      {:error, %Ecto.Changeset{}}

  """
  def delete_announcement(%Announcement{} = announcement) do
    Repo.delete(announcement)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking announcement changes.

  ## Examples

      iex> change_announcement(announcement)
      %Ecto.Changeset{source: %Announcement{}}

  """
  def change_announcement(%Announcement{} = announcement, attrs \\ %{}) do
    Announcement.changeset(announcement, attrs)
  end

  defp filter_config(:announcements) do
    defconfig do
      date(:publish_on)
      text(:message)
      text(:people)
      text(:company)
      text(:announcement_id)
    end
  end

  defp filter_config(:events) do
    defconfig do
      text(:source)
      text(:external_id)
      text(:source_author)
      text(:source_channel)
    end
  end

  defp filter_config(:daily_event_summaries) do
    defconfig do
      text(:source)
      date(:day)
      number(:count)
    end
  end
end
