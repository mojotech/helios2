defmodule HeliosWeb.TestData.WidgetCollection do
  alias HeliosWeb.TestData.Location, as: LocationCollectionData

  # Each widget needs to have location eagerly loaded for the weather resolver
  def enabled do
    "[{\"id\":2,\"name\":\"Weather\",\"enabled\":true,\"duration_seconds\":20,\"position\":1,\"created_at\":\"2022-02-22T19:48:40.759Z\",\"updated_at\":\"2022-02-22T19:48:40.759Z\",\"location_id\":1,\"start\":null,\"stop\":null,\"sidebar_text\":\"Weather\",\"show_weather\":false}, {\"id\":5,\"name\":\"Traffic\",\"enabled\":true,\"duration_seconds\":20,\"position\":4,\"created_at\":\"2022-02-28T20:08:27.394Z\",\"updated_at\":\"2022-02-28T20:08:27.394Z\",\"location_id\":1,\"start\":{\"hour\":0,\"minute\":0,\"second\":0,\"second_of_day\":57600},\"stop\":{\"hour\":0,\"minute\":0,\"second\":0,\"second_of_day\":82800},\"sidebar_text\":\"Traffic\",\"show_weather\":true}]"
    |> Jason.decode!()
    |> Enum.map(fn widget ->
      Map.put(widget, "location", Jason.decode!(LocationCollectionData.location("Providence")))
    end)
  end
end
