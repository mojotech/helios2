# This file is responsible for configuring your application
# and its dependencies with the aid of the Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
import Config

config :helios,
  ecto_repos: [Helios.Repo]

# Configures the endpoint
config :helios, HeliosWeb.Endpoint,
  url: [host: "localhost"],
  render_errors: [view: HeliosWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: Helios.PubSub,
  live_view: [signing_salt: "ryFqXbhy"],
  slack_bearer_token: System.get_env("SLACK_BEARER_TOKEN"),
  upload_bearer_token: System.get_env("UPLOAD_BEARER_TOKEN")

config :exq,
  url: System.get_env("REDIS_URL", "redis://localhost:6379/1")

# Configure Twitter
config :extwitter, :oauth,
  consumer_key: System.get_env("TWITTER_CONSUMER_KEY"),
  consumer_secret: System.get_env("TWITTER_CONSUMER_SECRET"),
  access_token: System.get_env("TWITTER_ACCESS_TOKEN"),
  access_token_secret: System.get_env("TWITTER_ACCESS_SECRET")

config :waffle,
  storage: Waffle.Storage.S3,
  bucket: {:system, "S3_BUCKET"}

config :ex_aws,
  json_codec: Jason,
  access_key_id: [{:system, "AWS_ACCESS_KEY_ID"}, :instance_role],
  secret_access_key: [{:system, "AWS_SECRET_ACCESS_KEY"}, :instance_role],
  region: "us-east-1"

config :ex_aws, :hackney_opts,
  follow_redirect: true,
  recv_timeout: 30_000

# Configures the mailer
#
# By default it uses the "Local" adapter which stores the emails
# locally. You can see the emails in your browser, at "/dev/mailbox".
#
# For production it's recommended to configure a different adapter
# at the `config/runtime.exs`.
config :helios, Helios.Mailer, adapter: Swoosh.Adapters.Local

# Swoosh API client is needed for adapters other than SMTP.
config :swoosh, :api_client, false

# Configure esbuild (the version is required)
config :esbuild,
  version: "0.14.0",
  default: [
    args:
      ~w(js/app.js --bundle --target=es2017 --outdir=../priv/static/assets --external:/fonts/* --external:/images/*),
    cd: Path.expand("../assets", __DIR__),
    env: %{"NODE_PATH" => Path.expand("../deps", __DIR__)}
  ]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

config :elixir, :time_zone_database, Tzdata.TimeZoneDatabase

config :cors_plug,
  origin: [System.get_env("FRONTEND_URL"), "https://mojotech-helios2.herokuapp.com/"],
  methods: ["*"]

config :helios, Helios.Scheduler,
  jobs: [
    {"*/5 * * * *", {Helios.Workers.ShaPollerWorker, :perform, []}},
    {"*/5 * * * *", {Helios.Workers.WeatherPollerWorker, :perform, []}}
  ]

config :torch,
  otp_app: :helios,
  template_format: "heex"

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{config_env()}.exs"
