defmodule HeliosWeb.Schema.Types.Tweet do
  use Absinthe.Schema.Notation

  object :user do
    field(:name, :string)
    field(:handle, :string)
    field(:avatar, :string)
  end

  object :interaction do
    field(:retweet_count, :integer)
    field(:favorite_count, :integer)
  end

  object :twitter_image do
    field(:id, :integer)
    field(:media_url, :string)
  end

  object :media do
    field(:images, list_of(:twitter_image))
    field(:link, :string)
  end

  object :tweet do
    field(:status, :string)
    field(:created_at, :datetime)
    field(:text, :string)
    field(:interactions, :interaction)
    field(:media, :media)
    field(:user, :user)
  end
end
