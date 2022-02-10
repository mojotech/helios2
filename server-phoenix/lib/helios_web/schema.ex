defmodule HeliosWeb.Schema do
  use Absinthe.Schema

  # Types
  import_types(HeliosWeb.Schema.Types.Weather)

  # Queries
  import_types(HeliosWeb.Schema.Queries.Weather)

  # Mutations
  import_types(HeliosWeb.Schema.Mutations.Weather)

  query do
    import_fields(:weather_queries)
  end

  mutation do
    import_fields(:weather_mutations)
  end
end
