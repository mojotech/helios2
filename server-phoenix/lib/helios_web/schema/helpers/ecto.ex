defmodule HeliosWeb.Schema.Helpers.Ecto do
  alias Helios.Repo

  def find_or_initialize_by(model, params \\ [], data) do
    case Repo.get_by(model, params) do
      nil ->
        params = Enum.into(params, %{})
        data = Map.merge(data, params)
        Repo.insert!(data)

      result ->
        result
    end
  end
end
