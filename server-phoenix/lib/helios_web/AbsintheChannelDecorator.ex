# Reference code
# https://github.com/absinthe-graphql/absinthe_phoenix/issues/39#issuecomment-982310059

defmodule HeliosWeb.AbsintheChannelDecorator do
  use Phoenix.Channel
  alias HeliosWeb.AbsintheSocketDecorator, as: Socket
  require Logger

  def join(topic, msg, socket) do
    IO.puts("channel decorator JOIN")
    Absinthe.Phoenix.Channel.join(topic, msg, socket)
  end

  def terminate(reason, socket) do
    IO.puts("channel decorator TERMINATE")

    case reason do
      {:shutdown, :closed} ->
        socket = run_unsubscribe(socket, "terminate")
        {:noreply, socket}

      _ ->
        IO.puts("nothing")
    end
  end

  defp run_unsubscribe(socket, status) do
    # status (enter, leave and terminate)
    config = socket.assigns[:absinthe]

    Map.get(socket.assigns.absinthe.opts[:context], "payload", "")
    |> case do
      payload when payload != "" ->
        with variables when is_map(variables) <- extract_variables(payload) do
          query = Map.get(payload, "query", "")

          config_opts = [
            context:
              Map.merge(
                config.opts[:context],
                %{"status" => status}
              )
          ]

          opts = Keyword.put(config_opts, :variables, variables)
          run(query, config[:schema], config[:pipeline], opts)
        end

      _ ->
        socket
    end
  end

  defp run(document, schema, pipeline, options) do
    {module, fun} = pipeline

    case Absinthe.Pipeline.run(document, apply(module, fun, [schema, options])) do
      {:ok, %{result: result, execution: res}, _phases} ->
        {:ok, result, res.context}

      {:error, msg, _phases} ->
        {:error, msg}
    end
  end

  defp extract_variables(payload) do
    case Map.get(payload, "variables", %{}) do
      nil -> %{}
      map -> map
    end
  end

  def handle_in("doc", payload, socket) do
    socket =
      Socket.put_options(
        socket,
        context:
          Map.merge(
            socket.assigns.absinthe.opts[:context],
            %{
              "status" => "enter",
              "payload" => %{
                "query" => Map.get(payload, "query", "")
              }
            }
          )
      )

    Absinthe.Phoenix.Channel.handle_in("doc", payload, socket)
  end

  def handle_in("unsubscribe", %{"subscriptionId" => doc_id}, socket) do
    socket =
      Socket.put_options(
        socket,
        context:
          Map.merge(
            socket.assigns.absinthe.opts[:context],
            %{
              "status" => "leave"
            }
          )
      )

    Absinthe.Phoenix.Channel.handle_in("unsubscribe", %{"subscriptionId" => doc_id}, socket)
  end

  defdelegate handle_in(event, msg, arg2), to: Absinthe.Phoenix.Channel

  defdelegate default_pipeline(schema, options), to: Absinthe.Phoenix.Channel
end
