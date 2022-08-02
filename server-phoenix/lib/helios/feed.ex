defmodule Helios.Feed do
  use Ecto.Schema

  import Ecto.Query

  @primary_key {:uuid, :binary_id, autogenerate: true}
  schema "feed" do
    field :source, :string
    field :author, :string

    timestamps()
  end
end
