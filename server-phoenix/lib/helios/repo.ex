defmodule Helios.Repo do
  use Ecto.Repo,
    otp_app: :helios,
    adapter: Ecto.Adapters.SQLite3
    # adapter: Ecto.Adapters.Postgres
end
