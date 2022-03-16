defmodule HeliosWeb.Schema.Resolvers.Tweet do
  alias HeliosWeb.Clients.TwitterClient

  def tweets(_parent, _args, _info) do
    {:ok, TwitterClient.latest_tweets()}
  end
end
