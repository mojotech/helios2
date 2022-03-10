defmodule HeliosWeb.Schema.Resolvers.WidgetCollection do
  alias HeliosWeb.TestData.WidgetCollection, as: WidgetCollectionData

  def enabled(_parent, _args, _info) do
    {:ok, WidgetCollectionData.enabled}
  end

  def next(_parent, %{current_widget_id: current_widget_id}, _info) do
    decoded_data = WidgetCollectionData.enabled
    num_widgets = Enum.count(decoded_data)

    case Enum.find_index(decoded_data, fn widget -> widget["id"] === current_widget_id end) do
      nil ->
        {:ok, Enum.at(decoded_data, 0)}

      x when x === num_widgets - 1 ->
        {:ok, Enum.at(decoded_data, 0)}

      x ->
        {:ok, Enum.at(decoded_data, x + 1)}
    end
  end

  def by_id_or_first(_parent, %{id: id}, _info) do
    decoded_data = WidgetCollectionData.enabled
    id_exists = Enum.find(decoded_data, fn widget -> widget["id"] === id end)
    {:ok, id_exists || Enum.at(decoded_data, 0)}
  end
end
