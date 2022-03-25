defmodule Helios.Repo.Migrations.AddDailyEventSummariesTable do
  use Ecto.Migration

  def change do
    create table("daily_event_summaries") do
      add :source, :string, null: false
      add :day, :date, null: false
      add :count, :integer, null: false

      timestamps(inserted_at: :created_at, type: :utc_datetime)
    end
  end
end
