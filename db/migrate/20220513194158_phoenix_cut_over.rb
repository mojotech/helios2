# This migration creates a phoenix schema migrations table with this migration's timestamp preload.
# This will prevent existing databases from running the ecto migration with the matching timestamp
# that loads the entire rails schema.
class PhoenixCutOver < ActiveRecord::Migration[6.1]
  def up
    execute(
      'CREATE TABLE public.phoenix_schema_migrations ( '\
      'version bigint NOT NULL, '\
      'inserted_at timestamp(0) without time zone '\
      ');'
    )
    execute(
      'ALTER TABLE ONLY public.phoenix_schema_migrations '\
      'ADD CONSTRAINT phoenix_schema_migrations_pkey PRIMARY KEY (version);'
    )
    execute("INSERT INTO public.phoenix_schema_migrations VALUES(20220513194158,'2022-05-13T19:41:58');")
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
