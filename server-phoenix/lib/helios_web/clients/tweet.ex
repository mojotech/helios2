defmodule HeliosWeb.Clients.Tweet do
  defstruct [:text, :media, :interactions, :status, :user, :created_at]

  defmodule InteractionQuery do
    defstruct [:favorite_count, :retweet_count]
  end

  defmodule MediaQuery do
    defstruct [:images, :link]
  end

  defmodule UserQuery do
    defstruct [:name, :handle, :avatar]
  end

  def from_api(%ExTwitter.Model.Tweet{} = tweet) do
    %HeliosWeb.Clients.Tweet{
      text: text(tweet),
      media: media(tweet),
      interactions: interactions(tweet),
      status: status(tweet),
      user: user(tweet),
      created_at: tweet.created_at
    }
  end

  def attributes(t) do
    case status(t) do
      "retweet" ->
        t.retweeted_status

      "quote" ->
        t.quoted_status

      _ ->
        t
    end
  end

  def media(t) do
    %MediaQuery{images: images(t), link: link(t)}
  end

  def images(t) do
    case attributes(t).extended_entities do
      nil -> nil
      entities -> entities.media
    end
  end

  def link(t) do
    case List.first(attributes(t).entities.urls) do
      nil -> nil
      url -> url.expanded_url
    end
  end

  def interactions(t) do
    %InteractionQuery{favorite_count: t.favorite_count, retweet_count: t.retweet_count}
  end

  def text(t) do
    t.text
    |> String.split(~r/\s|\n/)
    |> Enum.filter(fn word -> String.contains?(word, "http") end)
    |> Enum.reduce(t.text, fn link, acc -> String.replace(acc, link, "") end)
  end

  def status(t) do
    cond do
      t.retweeted_status ->
        "retweet"

      t.quoted_status ->
        "quote"

      true ->
        "normal"
    end
  end

  def user(t) do
    user = t.user
    large_profile_image_url = String.replace(user.profile_image_url_https, "_normal", "")
    %UserQuery{name: user.name, handle: user.screen_name, avatar: large_profile_image_url}
  end
end
