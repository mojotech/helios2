defmodule Helios.Feed do
  use Ecto.Schema

  import Ecto.Changeset
  import Ecto.Query

  schema "feeds" do
    #field :source, Ecto.Enum, values: [:github_commit, :github_pull, :slack_message]
    field :source, :string
    #field :inserted_at, :naive_datetime
    field :author, :string
    field :file_url, :string
    #field :updated_at, :naive_datetime
    timestamps()
  end


end
