defmodule Helios.Accounts.DeveloperUser do
  use Ecto.Schema

  import Ecto.Changeset

  @primary_key {:id, :id, autogenerate: true}
  schema "developer_users" do
    field :public_key, :string
    field :git_handle, :string
    field :slack_handle, :string

    timestamps()
  end

  def changeset(user, attrs \\ %{}) do
    user
    |> cast(attrs, [:public_key, :git_handle, :slack_handle])
    |> validate_required([:public_key, :git_handle, :slack_handle])
  end
end
