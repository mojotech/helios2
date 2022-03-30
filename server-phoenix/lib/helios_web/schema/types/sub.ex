defmodule HeliosWeb.Schema.Types.Sub do
  use Absinthe.Schema.Notation
  use Agent

  def start_link(initial_value) do
    Agent.start_link(fn -> initial_value end, name: __MODULE__)
  end

  def get_args do
    Agent.get(__MODULE__, fn state -> state end)
  end

  def add_args(args) do
    Agent.update(__MODULE__, fn state -> state ++ [args] end)
  end

  def remove_args(args) do
    Agent.update(__MODULE__, fn state -> state -- [args] end)
  end

  object :sub do
    field(:event_published, non_null(:event), description: "An event was published to the API") do
      config(fn _args, _resolution ->
        {:ok, topic: "all"}
      end)

      resolve(fn event, _, _ ->
        {:ok, event}
      end)
    end

    field(:weather_published, non_null(:weather)) do
      description("Latest weather data retrieved")
      arg(:latitude, non_null(:float))
      arg(:longitude, non_null(:float))

      config(fn args,
                %{
                  context: %{
                    "status" => status
                  }
                } ->
        IO.puts("Channel Status")
        IO.inspect(status)

        if(status == "enter") do
          IO.puts("subscribed")
          add_args(args)
        end

        if(status == "leave" || status == "terminate") do
          IO.puts("unsubscribed")
          remove_args(args)
        end

        {:ok, topic: [args.latitude, args.longitude], context_id: "global"}
      end)

      resolve(fn event, _, _ ->
        {:ok, event}
      end)
    end

    field(:announcement_published, non_null(:announcement),
      description: "An announcement was published"
    ) do
      config(fn _args, _resolution ->
        {:ok, topic: "new"}
      end)
    end

    field(:deployment_sha, non_null(:string), description: "Updated SHA value") do
      config(fn _args, _resolution ->
        {:ok, topic: "update"}
      end)

      resolve(fn event, _, _ ->
        {:ok, event}
      end)
    end
  end
end
