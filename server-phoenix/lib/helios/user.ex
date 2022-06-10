defmodule Helios.User do
  use Ecto.Schema

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
end
