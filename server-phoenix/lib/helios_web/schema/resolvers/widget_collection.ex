defmodule HeliosWeb.Schema.Resolvers.WidgetCollection do
  alias HeliosWeb.TestData.WidgetCollection, as: WidgetCollectionData
  def enabled(_parent, _args, _info) do
    {:ok, Jason.decode!(WidgetCollectionData.enabled)}
  end

  def next(_parent, %{current_widget_id: current_widget_id}, _info) do
    decodedData = Jason.decode!(WidgetCollectionData.enabled)
    numWidgets = Enum.count(decodedData)
    case Enum.find_index(decodedData, fn widget -> widget["id"] === current_widget_id end) do
      nil ->
        {:ok, Enum.at(decodedData, 0)}
      x when x === numWidgets - 1 -> {:ok, Enum.at(decodedData, 0)}
      x ->
        {:ok, Enum.at(decodedData, x + 1)}
    end
  end

  def by_id_or_first(_parent, %{id: id}, _info) do
    {:ok, Enum.find(Jason.decode!(WidgetCollectionData.enabled), fn widget -> widget["id"] === id end)}
  end
end
