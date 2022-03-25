defmodule Helios.Workers.ShaPollerWorker do
  use Absinthe.Schema.Notation

  def perform do
    IO.puts("Running sha poll")

    Absinthe.Subscription.publish(
      HeliosWeb.Endpoint,
      System.get_env("HEROKU_SLUG_COMMIT") || "NA",
      deployment_sha: "update"
    )
  end
end
