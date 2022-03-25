defmodule Helios.Repo.Migrations.AddEventsTable do
  use Ecto.Migration

  def change do
    create table("events") do
      add :source, :string
      add :external_id, :string
      timestamps(inserted_at: :created_at, type: :utc_datetime)
    end

    create index("events", [:source, :external_id], unique: true)
  end
end
