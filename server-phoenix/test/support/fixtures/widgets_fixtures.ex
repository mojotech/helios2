defmodule Helios.WidgetsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Helios.Widgets` context.
  """

  @doc """
  Generate a widget.
  """
  def widget_fixture(attrs \\ %{}) do
    {:ok, widget} =
      attrs
      |> Enum.into(%{
        duration_seconds: 42,
        enabled: true,
        name: "some name",
        position: 42,
        show_weather: true,
        sidebar_text: "some sidebar_text",
        start: ~T[14:00:00],
        stop: ~T[14:00:00]
      })
      |> Helios.Widgets.create_widget()

    widget
  end

  @doc """
  Generate a traffic_cam.
  """
  def traffic_cam_fixture(attrs \\ %{}) do
    {:ok, traffic_cam} =
      attrs
      |> Enum.into(%{
        feed_format: "some feed_format",
        title: "some title",
        url: "some url"
      })
      |> Helios.Widgets.create_traffic_cam()

    traffic_cam
  end
end
