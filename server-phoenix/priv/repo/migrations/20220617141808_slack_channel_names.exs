defmodule Helios.Repo.Migrations.SlackChannelNames do
  use Ecto.Migration

  def up do
    create table("slack_channel_names") do
      add :channel_id, :string
      add :channel_name, :string
      timestamps()
    end
  end

  def down do
    drop table("slack_channel_names")
  end
end
