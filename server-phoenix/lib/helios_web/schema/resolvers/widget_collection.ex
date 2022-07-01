defmodule HeliosWeb.Schema.Resolvers.WidgetCollection do
  alias HeliosWeb.Schema.Helpers.WidgetCollection, as: WidgetCollectionHelpers
  import Ecto.Query
  alias Helios.{Repo, Widgets.Widget, Locations.Location}

  def enabled(parent, _args, _info) when is_struct(parent, Location) do
    {:ok, WidgetCollectionHelpers.enabled_and_available(parent) |> Repo.all()}
  end

  def next(parent, %{current_widget_id: current_widget_id}, _info)
      when is_struct(parent, Location) do
    {:ok,
     WidgetCollectionHelpers.enabled_and_available(parent)
     |> Widget.next(current_widget_id)
     |> Repo.one() ||
       WidgetCollectionHelpers.enabled_and_available(parent) |> Widget.default() |> Repo.one()}
  end

  def by_id_or_first(parent, %{id: id}, _info) when is_struct(parent, Location) do
    scope = WidgetCollectionHelpers.enabled_and_available(parent)
    {:ok, Repo.get_by(scope, id: id) || scope |> first(:position) |> Repo.one()}
  end
end
