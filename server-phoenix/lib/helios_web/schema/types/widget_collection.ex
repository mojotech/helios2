defmodule HeliosWeb.Schema.Types.WidgetCollection do
  use Absinthe.Schema.Notation

  object :widget_collection do
    field(:enabled, list_of(:widget))

    field(:next, :widget) do
      arg(:current_widget_id, :integer)
    end

    field(:by_id_or_first, :widget) do
      arg(:id, :integer)
    end
  end
end
