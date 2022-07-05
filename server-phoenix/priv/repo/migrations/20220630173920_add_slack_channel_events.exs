defmodule Helios.Repo.Migrations.AddSlackChannelEvents do
  use Ecto.Migration

  def change do
    alter table("events") do
      add(:source_channel, :string)
    end
  end
end
