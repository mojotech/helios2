defmodule Helios.Repo.Migrations.ConvertRailsToPhoenix do
  use Ecto.Migration

  def change do
    execute(
      "ALTER TABLE widgets ALTER COLUMN start TYPE time USING start::time(0) without time zone"
    )

    execute(
      "ALTER TABLE widgets ALTER COLUMN stop TYPE time USING stop::time(0) without time zone"
    )
  end
end
