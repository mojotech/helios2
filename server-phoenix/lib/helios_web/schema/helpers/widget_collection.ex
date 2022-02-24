defmodule HeliosWeb.Schema.Helpers.WidgetCollection do
  def enabled_and_available do
    [
      %{
        name: "Weather",
        durationSeconds: 20,
        id: 2,
        locationId: "1",
        position: 1,
        showWeather: false,
        sidebarText: "Weather"
      },
      %{
        name: "Twitter",
        durationSeconds: 20,
        id: 3,
        locationId: "1",
        position: 2,
        showWeather: true,
        sidebarText: "@MojoTech"
      },
      %{
        name: "Numbers",
        durationSeconds: 20,
        id: 4,
        locationId: "1",
        position: 3,
        showWeather: true,
        sidebarText: "MojoTech by the Numbers"
      },
      %{
        name: "Events",
        durationSeconds: 20,
        id: 6,
        locationId: "1",
        position: 5,
        showWeather: true,
        sidebarText: "Events at MojoTech"
      }
    ]
  end
end
