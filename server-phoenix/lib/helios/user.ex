defmodule Helios.User do
  use Ecto.Schema

  import Ecto.Changeset
  import Ecto.Query

  alias Helios.User

  @primary_key {:id, :id, autogenerate: true}
  schema "users" do
    field :user_name, :string
    field :public_key, :string

    timestamps(inserted_at: :created_at, type: :utc_datetime)
  end

  def changeset(user, attrs \\ %{}) do
    user
    |> cast(attrs, [:user_name, :public_key])
    |> validate_required([:user_name, :public_key])
  end
end
