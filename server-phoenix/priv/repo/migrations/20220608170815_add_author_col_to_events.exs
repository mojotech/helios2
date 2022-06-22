defmodule Helios.Repo.Migrations.AddAuthorColToEvents do
  use Ecto.Migration

  def change do
    alter table("events") do
      add(:source_author, :string)
    end
  end
end
