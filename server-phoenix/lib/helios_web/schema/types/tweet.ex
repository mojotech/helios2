defmodule HeliosWeb.Schema.Types.Tweet do
  use Absinthe.Schema.Notation

  object :user do
    field(:name, non_null(:string))
    field(:handle, non_null(:string))
    field(:avatar, non_null(:string))
  end

  object :interaction do
    field(:retweet_count, non_null(:integer))
    field(:favorite_count, non_null(:integer))
  end

  object :twitter_image do
    field(:id, non_null(:integer))
    field(:media_url, non_null(:string))
  end

  object :media do
    field(:images, list_of(:twitter_image))
    field(:link, :string)
  end

  object :tweet do
    field(:status, non_null(:string))
    field(:created_at, non_null(:string))
    field(:text, non_null(:string))
    field(:interactions, non_null(:interaction))
    field(:media, :media)
    field(:user, non_null(:user))
  end
end
