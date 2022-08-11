defmodule HeliosWeb.Schema.Queries.Feed do
  use Absinthe.Schema.Notation

  alias HeliosWeb.Schema.Resolvers.Feed

  object :feed_queries do
    field :feeds, list_of(:feed) do
      resolve(&Feed.feeds/3)
    end
  end
end
