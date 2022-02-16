defmodule HeliosWeb.Schema.Types.Sub do
  use Absinthe.Schema.Notation

  object :sub do
    field(:event_published, :event, description: "An event was published to the API")

    field(:weather_published, :weather) do
      description("Latest weather data retrieved")
      arg(:latitude, :float)
      arg(:longitude, :float)
    end

    field(:announcement_published, :announcement, description: "An announcement was published")

    field(:deployment_sha, :string, description: "Updated SHA value")
  end
end
