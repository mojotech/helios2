defmodule Helios.Repo.Migrations.CreateAdminsAuthTables do
  use Ecto.Migration

  def change do
    execute "CREATE EXTENSION IF NOT EXISTS citext", ""

    create table(:admins) do
      add :email, :citext, null: false
      add :hashed_password, :string, null: false
      add :confirmed_at, :naive_datetime
      timestamps()
    end

    create unique_index(:admins, [:email])

    create table(:admins_tokens) do
      add :admin_id, references(:admins, on_delete: :delete_all), null: false
      add :token, :binary, null: false
      add :context, :string, null: false
      add :sent_to, :string
      timestamps(updated_at: false)
    end

    create index(:admins_tokens, [:admin_id])
    create unique_index(:admins_tokens, [:context, :token])
  end
end
