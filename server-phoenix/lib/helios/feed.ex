defmodule Helios.Feed do
  use Ecto.Schema

  import Ecto.Query

  @primary_key {:uuid, :binary_id, autogenerate: true}
  schema "feed" do
    field :source, :string
    field :author, :string

    timestamps()
  end

  def top_images(query \\ __MODULE__) do
    from(q in query,
      select: %{"uuid" => q.uuid},
      limit: 6,
      order_by: fragment("RANDOM()")
    )
  end
end
