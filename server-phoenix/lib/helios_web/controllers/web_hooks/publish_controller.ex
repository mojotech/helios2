defmodule HeliosWeb.WebHooks.PublishController do
  use HeliosWeb, :controller
  alias Helios.{Repo, Event}

  def handle(conn, params) do
    event =
      Map.update!(params, "source", fn prev_val ->
        case prev_val do
          "github_commit" -> :github_commit
          "github_pull" -> :github_pull
          "slack_message" -> :slack_message
        end
      end)

    event_atom_keys = for {key, val} <- event, into: %{}, do: {String.to_atom(key), val}

    Absinthe.Subscription.publish(
      HeliosWeb.Endpoint,
      struct(Event, event_atom_keys),
      event_published: "all"
    )

    conn |> send_resp(200, "OK")
  end
end
