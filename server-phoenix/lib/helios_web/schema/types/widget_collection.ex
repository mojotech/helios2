defmodule HeliosWeb.Schema.Types.WidgetCollection do
  use Absinthe.Schema.Notation

  alias HeliosWeb.Schema.Resolvers.WidgetCollection

  object :widget_collection do
    field :enabled, non_null(list_of(:widget)) do
      resolve(&WidgetCollection.enabled/3)
    end

    field :next, non_null(:widget) do
      arg(:current_widget_id, :integer)
      resolve(&WidgetCollection.next/3)
    end

    field :by_id_or_first, non_null(:widget) do
      arg(:id, :integer)
      resolve(&WidgetCollection.by_id_or_first/3)
    end
  end
end
