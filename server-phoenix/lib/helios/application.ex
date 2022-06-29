defmodule Helios.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application
  alias HeliosWeb.Schema.Types.Sub

  @impl true
  def start(_type, _args) do
    Sub.start_link([])

    unless Mix.env() == :prod do
      Dotenv.load()
      Mix.Task.run("loadconfig")
    end

    children = [
      # Start the Ecto repository
      Helios.Repo,
      # Start the Telemetry supervisor
      {Task.Supervisor, name: SlackImageDownloader},
      HeliosWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: Helios.PubSub},
      # Start the Endpoint (http/https)
      HeliosWeb.Endpoint,
      # Start a worker by calling: Helios.Worker.start_link(arg)
      # {Helios.Worker, arg}
      {ConCache,
       [
         name: :weather_cache,
         ttl_check_interval: :timer.minutes(1),
         global_ttl: :timer.minutes(5)
       ]},
      {Absinthe.Subscription, [HeliosWeb.Endpoint]},
      Helios.Scheduler
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Helios.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    HeliosWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
