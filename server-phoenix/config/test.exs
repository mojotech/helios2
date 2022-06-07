import Config

# Configure your database
#
# The MIX_TEST_PARTITION environment variable can be used
# to provide built-in test partitioning in CI environment.
# Run `mix help test` for more information.
config :helios, Helios.Repo,
  url:
    System.get_env(
      "TEST_DATABASE_URL",
      "ecto://postgres:postgres@localhost:5432/helios_test#{System.get_env("MIX_TEST_PARTITION")}"
    ),
  pool: Ecto.Adapters.SQL.Sandbox,
  pool_size: 10,
  migration_source: "phoenix_schema_migrations"

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :helios, HeliosWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "M74HwRLw7S71xZGwVjKbIyJTQxi1LtAObebG/DqMmWtmbTRc+9NpzkWHO2ea3tNB",
  server: false

# In test we don't send emails.
config :helios, Helios.Mailer, adapter: Swoosh.Adapters.Test

# Print only warnings and errors during test
config :logger, level: :warn

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime

# Disables redis for test
config :exq, start_on_application: false

config :cors_plug,
  origin: ["*"],
  methods: ["*"]
