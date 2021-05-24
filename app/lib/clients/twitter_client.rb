require 'twitter'

class Clients::TwitterClient
  @client = Twitter::REST::Client.new do |config|
    config.consumer_key = AppEnv['TWITTER_CONSUMER_KEY']
    config.consumer_secret = AppEnv['TWITTER_CONSUMER_SECRET']
    config.access_token = AppEnv['TWITTER_ACCESS_TOKEN']
    config.access_token_secret = AppEnv['TWITTER_ACCESS_SECRET']
  end

  def self.latest_tweets
    # API gets count amt, then filters out rts and replies
    # This guarantees there will always be a tweet
    feed = @client
           .user_timeline('mojotech', count: 5, include_rts: true,
                                      exclude_replies: false, tweet_mode: 'extended')
    feed.map { |t| Clients::CreateTweet.new(t) }
  end
end
