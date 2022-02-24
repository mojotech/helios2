defmodule Helios.Widget do
  use Ecto.Schema
  import Ecto.Changeset
  alias Helios.Location
  import Ecto.Query

  @primary_key {:id, :id, autogenerate: true}
  schema "widgets" do
    field :name, :string, presence: true
    field :enabled, :boolean, presence: true
    field :duration_seconds, :integer, presence: true
    field :position, :integer, presence: true
    field :created_at, :utc_datetime, presence: true
    field :updated_at, :utc_datetime, presence: true
    field :start, :time
    field :stop, :time
    field :sidebar_text, :string
    field :show_weather, :boolean

    belongs_to :location, Location
  end
end
