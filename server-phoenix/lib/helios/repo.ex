defmodule Helios.Repo do
  use Ecto.Repo,
    otp_app: :helios,
    adapter: Ecto.Adapters.Postgres
end
