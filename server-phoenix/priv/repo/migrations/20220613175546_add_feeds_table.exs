defmodule Helios.Repo.Migrations.AddFeedsTable do
  use Ecto.Migration

  def up do
      create table("feeds") do
        add :source, :string
        #add :inserted_at, :naive_datetime
        add :author, :string
        add :file_url, :string
        #add :updated_at, :naive_datetime
        timestamps()
      end

  end

  def down do
      drop table("feeds")
  end
end
