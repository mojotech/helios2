defmodule HeliosWeb.Schema.Queries.EventCollection do
  use Absinthe.Schema.Notation

  alias HeliosWeb.Schema.Resolvers.EventCollection

  object :event_collection_queries do
    field :events, :event_collection do
      description("MojoTech slack/github events")
      arg(:created_after, :string)
      arg(:type, :event_source)
      resolve(&EventCollection.events/3)
    end
  end
end
