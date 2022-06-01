defmodule Helios.Repo.Migrations.ChangeColumnNames do
  use Ecto.Migration

  def change do
    rename table("admin_users"), :remember_created_at, to: :remember_inserted_at
    rename table("admin_users"), :created_at, to: :inserted_at
    rename table("announcements"), :created_at, to: :inserted_at
    rename table("daily_event_summaries"), :created_at, to: :inserted_at
    rename table("developer_users"), :created_at, to: :inserted_at
    rename table("events"), :created_at, to: :inserted_at
    rename table("locations"), :created_at, to: :inserted_at
    rename table("traffic_cams"), :created_at, to: :inserted_at
    rename table("users"), :created_at, to: :inserted_at
    rename table("widgets"), :created_at, to: :inserted_at
  end
end
