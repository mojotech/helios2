defmodule HeliosWeb.Schema.Queries.EventCollection do
  use Absinthe.Schema.Notation

  alias HeliosWeb.Schema.Resolvers.EventCollection

  object :event_collection_queries do
    field :events, :event_collection do
      description("MojoTech slack/github events")
      arg(:created_after, :datetime, default_value: nil)
      arg(:type, :event_source, default_value: nil)
      resolve(&EventCollection.events/2)
    end
  end
end
