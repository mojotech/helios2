defmodule Helios.Repo.Migrations.AddLocationsTable do
  use Ecto.Migration

  def change do
    create table("locations") do
      add :latitude, :float, null: false
      add :longitude, :float, null: false
      add :city_name, :string, null: false
      add :time_zone, :string, null: false
      add :wifi_name, :string
      add :wifi_password, :string
      add :bathroom_code, :string

      timestamps(inserted_at: :created_at, type: :utc_datetime)
    end
  end
end
