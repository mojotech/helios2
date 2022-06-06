defmodule HeliosWeb.Presence do
  @moduledoc """
  Provides presence tracking to channels and processes.

  See the [`Phoenix.Presence`](https://hexdocs.pm/phoenix/Phoenix.Presence.html)
  docs for more details.
  """
<<<<<<< HEAD
  use Phoenix.Presence,
    otp_app: :helios,
    pubsub_server: Helios.PubSub
=======
  use Phoenix.Presence, otp_app: :helios,
                        pubsub_server: Helios.PubSub
>>>>>>> 3e9fa9aed7669fdd76ab787007a8b053707b8d7b
end
