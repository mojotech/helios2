defmodule Helios.Repo.Migrations.AddFeedTable do
  use Ecto.Migration

  def up do
    create table("feed") do
      add :uuid, :uuid, primary_key: true
      add :source, :string
      add :author, :string

      timestamps()
    end
  end

  def down do
    drop table("feed")
  end
end
