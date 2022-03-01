defmodule HeliosWeb.Schema.Types.Sub do
  use Absinthe.Schema.Notation

  object :sub do
    field(:event_published, non_null(:event), description: "An event was published to the API")

    field(:weather_published, non_null(:weather)) do
      description("Latest weather data retrieved")
      arg(:latitude, non_null(:float))
      arg(:longitude, non_null(:float))
    end

    field(:announcement_published, non_null(:announcement), description: "An announcement was published")

    field(:deployment_sha, non_null(:string), description: "Updated SHA value")
  end
end