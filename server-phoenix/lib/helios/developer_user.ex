defmodule Helios.DeveloperUser do
  use Ecto.Schema

  import Ecto.Changeset
  import Ecto.Query

  alias Helios.User

  @primary_key {:id, :id, autogenerate: true}
  schema "developer_users" do
    field :public_key, :string
    field :git_handle, :string
    field :slack_handle, :string

    timestamps(inserted_at: :created_at, type: :utc_datetime)
  end

  def changeset(user, attrs \\ %{}) do
    user
    |> cast(attrs, [:public_key, :git_handle, :slack_handle])
    |> validate_required([:public_key, :git_handle, :slack_handle])
  end
end
