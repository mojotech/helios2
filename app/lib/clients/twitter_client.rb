require 'twitter'

class Clients::TwitterClient
  def self.authenticate
    client = Twitter::REST::Client.new do |config|
      config.consumer_key = ENV['TWITTER_CONSUMER_KEY']
      config.consumer_secret = ENV['TWITTER_CONSUMER_SECRET']
      config.access_token = ENV['TWITTER_ACCESS_TOKEN']
      config.access_token_secret = ENV['TWITTER_ACCESS_SECRET']
    end
    client
  end

  TwitterQuery = Struct.new(:created_at, :text, :favorite_count, :retweet_count, :media, :link)

  def self.get_media(latest)
    latest.attrs[:extended_entities][:media].first[:media_url]
  rescue StandardError
    nil
  end

  def self.get_link(latest)
    latest.instance_variable_get(:@attrs)[:entities][:urls].first[:expanded_url]
  rescue StandardError
    nil
  end

  def self.remove_hyperlinks(text)
    links = text.split(/\s|\n/).select { |word| word.include? "http" }
    clean_text = text
    links.each do |l|
      clean_text = clean_text.gsub(l, "")
    end
    clean_text
  end

  def self.latest_tweet
    client = authenticate

    # API gets count amt, then filters out rts and replies
    # This guarantees there will always be a tweet
    latest = client
             .user_timeline('mojotech', count: 5, include_rts: false, exclude_replies: true, tweet_mode: 'extended')
             .first

    tweet_text = latest.attrs[:full_text]

    query = TwitterQuery.new(latest.created_at, remove_hyperlinks(tweet_text), latest.favorite_count,
      latest.retweet_count, get_media(latest), get_link(latest))
    query
  end
end
