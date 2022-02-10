defmodule HeliosWeb.Schema.Queries.Weather do
  use Absinthe.Schema.Notation

  alias HeliosWeb.Schema.Resolvers.Weather

  object :weather_queries do
    field :all_weather, list_of(:weather) do
      resolve(&Weather.all_weather/3)
    end
  end
end
