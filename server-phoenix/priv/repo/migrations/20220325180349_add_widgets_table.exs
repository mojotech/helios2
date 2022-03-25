defmodule Helios.Repo.Migrations.AddWidgetsTable do
  use Ecto.Migration

  def change do
    create table("widgets") do
      add :name, :string, null: false
      add :enabled, :boolean, null: false
      add :duration_seconds, :integer, null: false
      add :position, :integer, null: false
      add :start, :time
      add :stop, :time
      add :sidebar_text, :string
      add :show_weather, :boolean
      add :location_id, :integer

      timestamps(inserted_at: :created_at, type: :utc_datetime)
    end
  end
end
