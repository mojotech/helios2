defmodule Helios.Announcement do
  use Ecto.Schema
  import Ecto.Changeset
  import Ecto.Query
  alias Helios.Location

  @primary_key {:id, :id, autogenerate: true}
  schema "announcements" do
    field :publish_on, :utc_datetime, presence: true
    field :message, :string
    field :people, :string, presence: true
    field :company, :string
    field :announcement_id, :string, presence: true
    field :created_at, :utc_datetime, presence: true
    field :updated_at, :utc_datetime, presence: true

    belongs_to :location, Location
  end
end
