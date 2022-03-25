defmodule Helios.Repo.Migrations.AddTrafficCamsTable do
  use Ecto.Migration

  def change do
    create table("traffic_cams") do
      add :title, :string, null: false
      add :url, :string, null: false
      add :location_id, :integer
      add :feed_format, :string

      timestamps(inserted_at: :created_at, type: :utc_datetime)
    end
  end
end
