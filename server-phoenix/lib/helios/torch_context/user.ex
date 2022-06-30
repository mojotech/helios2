#defmodule Helios.TorchContext.User do
#  use Ecto.Schema
#  import Ecto.Changeset
#
#  schema "users" do
#    field :id, :integer
#    field :inserted_at, :naive_datetime
#    field :public_key, :string
#    field :updated_at, :naive_datetime
#    field :user_name, :string
#
#    timestamps()
#  end
#
#  @doc false
#  def changeset(user, attrs) do
#    user
#    |> cast(attrs, [:id, :user_name, :public_key, :inserted_at, :updated_at])
#    |> validate_required([:id, :user_name, :public_key, :inserted_at, :updated_at])
#  end
#end