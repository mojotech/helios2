defmodule HeliosWeb.Schema.Queries.Tweet do
  use Absinthe.Schema.Notation

  alias HeliosWeb.Schema.Resolvers.Tweet

  object :tweet_queries do
    field :tweets, list_of(:tweet) do
      resolve(&Tweet.tweets/2)
    end
  end
end
