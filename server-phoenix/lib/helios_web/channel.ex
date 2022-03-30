defmodule HeliosWeb.Channel do
  use HeliosWeb, :channel
  alias HeliosWeb.Presence

  def join("some:topic", _params, socket) do
    send(self(), :after_join)
    {:ok, assign(socket, :user_id)}
  end

  def handle_info(:after_join, socket) do
    {:ok, _} =
      Presence.track(socket, socket.assigns.user_id, %{
        online_at: inspect(System.system_time(:second))
      })

    push(socket, "presence_state", Presence.list(socket))
    {:noreply, socket}
  end
end
