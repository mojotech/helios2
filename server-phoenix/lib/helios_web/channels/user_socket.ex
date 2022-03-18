defmodule HeliosWeb.UserSocket do
  use Phoenix.Socket

  use Absinthe.Phoenix.Socket,
    schema: HeliosWeb.Schema

  def connect(_params, socket) do
    {:ok, socket}
  end

  def id(_socket), do: nil
end
