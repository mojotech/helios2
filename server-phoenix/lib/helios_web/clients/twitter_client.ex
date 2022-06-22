defmodule HeliosWeb.Clients.TwitterClient do
  alias HeliosWeb.Clients.Tweet

  def latest_tweets do
    feed =
      ExTwitter.user_timeline(
        screen_name: "MojoTech",
        count: 5,
        include_rts: true,
        exclude_replies: false,
        tweet_mode: "extended"
      )

    Enum.map(feed, fn tweet -> Tweet.from_api(tweet) end)
  end
end
