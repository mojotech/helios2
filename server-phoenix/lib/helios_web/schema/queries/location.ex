defmodule HeliosWeb.Schema.Queries.Location do
  use Absinthe.Schema.Notation

  alias HeliosWeb.Schema.Resolvers.Location

  object :location_queries do
    field :location, :location do
      arg(:city_name, :string)
      resolve(&Location.location/2)
    end
  end
end
