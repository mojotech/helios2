defmodule HeliosWeb.AbsintheSocketDecorator do
  use Phoenix.Socket

  channel("__absinthe__:*", HeliosWeb.AbsintheChannelDecorator,
    assigns: %{
      __absinthe_schema__: HeliosWeb.Schema,
      __absinthe_pipeline__: nil
    }
  )

  def connect(_params, socket) do
    IO.puts("socket decorator connect")
    {:ok, socket}
  end

  def id(_socket), do: nil

  defdelegate put_options(socket, opts), to: Absinthe.Phoenix.Socket

  defdelegate put_schema(socket, schema), to: Absinthe.Phoenix.Socket
end
