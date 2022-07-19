defmodule HeliosWeb.Schema do
  use Absinthe.Schema

  def middleware(middleware, %{identifier: identifier} = field, object) do
    middleware_spec = {{__MODULE__, :get_atoms_or_string_key}, identifier}
    Absinthe.Schema.replace_default(middleware, middleware_spec, field, object)
  end

  def get_atoms_or_string_key(%{source: source} = res, key) when is_atom(key) do
    if Map.has_key?(source, key) do
      %{res | state: :resolved, value: Map.get(source, key)}
    else
      %{res | state: :resolved, value: Map.get(source, Atom.to_string(key))}
    end
  end

  def get_atoms_or_string_key(%{source: source} = res, key) when is_binary(key) do
    if Map.has_key?(source, key) do
      %{res | state: :resolved, value: Map.get(source, key)}
    else
      raise ArgumentError, message: "#{key} is missing in source"
    end
  end

  # Types
  import_types(Absinthe.Type.Custom)
  import_types(HeliosWeb.Schema.Types.Announcement)
  import_types(HeliosWeb.Schema.Types.EmployeeEventCollection)
  import_types(HeliosWeb.Schema.Types.Employee)
  import_types(HeliosWeb.Schema.Types.Event)
  import_types(HeliosWeb.Schema.Types.Feed)
  import_types(HeliosWeb.Schema.Types.EventCollection)
  import_types(HeliosWeb.Schema.Types.Location)
  import_types(HeliosWeb.Schema.Types.Solarcycle)
  import_types(HeliosWeb.Schema.Types.Sub)
  import_types(HeliosWeb.Schema.Types.TrafficCam)
  import_types(HeliosWeb.Schema.Types.Tweet)
  import_types(HeliosWeb.Schema.Types.Weather)
  import_types(HeliosWeb.Schema.Types.WidgetCollection)
  import_types(HeliosWeb.Schema.Types.Widget)
  import_types(HeliosWeb.Schema.Types.Sub)

  # Queries
  import_types(HeliosWeb.Schema.Queries.Location)
  import_types(HeliosWeb.Schema.Queries.Tweet)
  import_types(HeliosWeb.Schema.Queries.EventCollection)

  query do
    import_fields(:location_queries)
    import_fields(:tweet_queries)
    import_fields(:event_collection_queries)
  end

  subscription do
    import_fields(:sub)
  end
end
