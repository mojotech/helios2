require 'twitter'

class Clients::TwitterClient
  @client = Twitter::REST::Client.new do |config|
    config.consumer_key = ENV['TWITTER_CONSUMER_KEY']
    config.consumer_secret = ENV['TWITTER_CONSUMER_SECRET']
    config.access_token = ENV['TWITTER_ACCESS_TOKEN']
    config.access_token_secret = ENV['TWITTER_ACCESS_SECRET']
  end

  def self.latest_tweet
    # API gets count amt, then filters out rts and replies
    # This guarantees there will always be a tweet
    latest = @client
             .user_timeline('mojotech', count: 5, include_rts: true,
                                        exclude_replies: false, tweet_mode: 'extended')
             .first
    Clients::CreateTweet.new(latest)
  end
end
