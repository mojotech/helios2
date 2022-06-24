defmodule Helios.User do
  use Ecto.Schema

  import Ecto.Query
  import Ecto.Changeset

  @primary_key {:id, :id, autogenerate: true}
  schema "users" do
    field :user_name, :string
    field :public_key, :string

    timestamps()
  end

  def changeset(user, attrs \\ %{}) do
    user
    |> cast(attrs, [:user_name, :public_key])
    |> validate_required([:user_name, :public_key])
  end

  def get_key_for_user(query, user_name) do
    from(q in query, where: q.user_name == ^user_name, select: q.public_key)
  end
end
