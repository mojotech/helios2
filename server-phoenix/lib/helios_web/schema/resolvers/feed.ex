defmodule HeliosWeb.Schema.Resolvers.Feed do
  alias Helios.{Repo, Feed}
  require Logger

  def feeds(_parent, _args, _info) do
    feed_query =
      Feed
      |> Feed.top_images()
      |> Repo.all()

    {:ok, feed_query}
  end
end
