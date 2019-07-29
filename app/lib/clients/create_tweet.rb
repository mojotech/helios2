# Polls weather for subscribed locations
class Clients::CreateTweet
  delegate :text, :media, :interactions, :created_at, to: :@tweet

  InteractionQuery = Struct.new(:favorite_count, :retweet_count)

  MediaQuery = Struct.new(:image, :link)

  TwitterQuery = Struct.new(:created_at, :text, :interactions, :media)

  def initialize(tweet)
    @tweet = tweet
  end

  def created_at
    @tweet.created_at
  end
  def media
    MediaQuery.new(image, link)
  end

  def image
    @tweet.attrs[:extended_entities][:media].first[:media_url]
  rescue StandardError
    nil
  end

  def link
    @tweet.attrs[:entities][:urls].first[:expanded_url]
  rescue StandardError
    nil
  end

  def interactions
    InteractionQuery.new(@tweet.favorite_count, @tweet.retweet_count)
  end

  def text
    text = @tweet.attrs[:full_text]
    links = text.split(/\s|\n/).select { |word| word.include? "http" }
    clean_text = text
    links.each do |l|
      clean_text = clean_text.gsub(l, "")
    end
    clean_text
  end
end
