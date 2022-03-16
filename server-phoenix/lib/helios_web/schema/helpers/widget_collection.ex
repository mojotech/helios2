defmodule HeliosWeb.Schema.Helpers.WidgetCollection do
  alias Helios.{Widget, Location}

  def enabled_and_available(parent) when is_struct(parent, Location) do
    Widget
    |> Widget.with_location(parent)
    |> Widget.enabled()
    |> Widget.available(Location.time_now(parent))
  end
end
