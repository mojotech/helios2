defmodule Helios.Repo.Migrations.AddRailsSchema do
  use Ecto.Migration

  def change do
    ~r/;$/m
    |> Regex.split(File.read!("./priv/repo/migrations/rails_schema.sql"))
    |> Enum.map(&Regex.replace(~r/^--.*$/, &1, ''))
    |> Enum.map(&String.trim/1)
    |> Enum.filter(fn sql -> !Regex.match?(~r/^$/, sql) end)
    |> Enum.each(fn sql -> execute(sql) end)

    # The script above changes the pgsql search path which breaks inserting into phoenix_schema_migration afterwards
    # This switches it back to include 'public'
    execute("SELECT pg_catalog.set_config('search_path', 'public', false); ")
  end
end
