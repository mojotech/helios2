defmodule HeliosWeb.Schema.Resolvers.EventCollection do
  alias Helios.{Repo, Event}

  def events(_parent, args, _info) do
    event_query =
      case args do
        %{type: type} ->
          Event
          |> Event.with_source(type)

        %{created_after: created_after} ->
          Event
          |> Event.created_after(created_after)

        %{created_after: created_after, type: type} ->
          Event
          |> Event.with_source(type)
          |> Event.created_after(created_after)

        %{} ->
          Event
      end

    {:ok,
     %{
       all: Repo.all(event_query),
       count: Event.count(Event) |> Repo.all() |> Enum.into(%{})
     }}
  end
end
