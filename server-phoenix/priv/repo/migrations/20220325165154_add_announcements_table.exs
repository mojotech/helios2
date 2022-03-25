defmodule Helios.Repo.Migrations.AddAnnouncementsTable do
  use Ecto.Migration

  def change do
    create table("announcements") do
      add :publish_on, :utc_datetime, null: false
      add :message, :string
      add :people, :string, null: false
      add :company, :string
      add :announcement_id, :string, null: false
      timestamps(inserted_at: :created_at, type: :utc_datetime)
    end
  end
end
