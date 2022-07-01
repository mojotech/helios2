defmodule Helios.EventsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Helios.Events` context.
  """

  @doc """
  Generate a event.
  """
  def event_fixture(attrs \\ %{}) do
    {:ok, event} =
      attrs
      |> Enum.into(%{
        external_id: "some external_id",
        source: :github_commit,
        source_author: "some source_author"
      })
      |> Helios.Events.create_event()

    event
  end

  @doc """
  Generate a daily_event_summary.
  """
  def daily_event_summary_fixture(attrs \\ %{}) do
    {:ok, daily_event_summary} =
      attrs
      |> Enum.into(%{
        count: 42,
        day: ~D[2022-07-04],
        source: "some source"
      })
      |> Helios.Events.create_daily_event_summary()

    daily_event_summary
  end

  @doc """
  Generate a announcement.
  """
  def announcement_fixture(attrs \\ %{}) do
    {:ok, announcement} =
      attrs
      |> Enum.into(%{
        announcement_id: "some announcement_id",
        company: "some company",
        message: "some message",
        people: "some people",
        publish_on: ~N[2022-07-04 14:42:00]
      })
      |> Helios.Events.create_announcement()

    announcement
  end
end
