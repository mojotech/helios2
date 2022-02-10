defmodule HeliosWeb.Schema.Mutations.Weather do
  use Absinthe.Schema.Notation

  alias HeliosWeb.Schema.Resolvers.Weather

  object :weather_mutations do
    field :create_weather, list_of(:weather) do
      arg(:weather, :input_weather_params)
      resolve(&Weather.create/3)
    end
  end
end
