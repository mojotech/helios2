# Polls weather for subscribed locations
class Clients::CreateTweet
  delegate :text, :media, :interactions, :status, :user, :created_at, to: :@tweet

  InteractionQuery = Struct.new(:favorite_count, :retweet_count)

  MediaQuery = Struct.new(:image, :link)

  UserQuery = Struct.new(:name, :handle, :avatar)

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

 def status
    if @tweet.attrs[:retweeted]
      "retweet"
    elsif @tweet.attrs[:is_quote_status]
      "quote"
    else
      "normal"
    end
  end

  def user
    user = if status == "retweet"
             @tweet.attrs[:retweeted_status][:user]
           else
             @tweet.attrs[:user]
    end
    # removing '_normal' from url given returns orginal sized picture
    large_profile_image_url = user[:profile_image_url].remove("_normal")
    UserQuery.new(user[:name], user[:screen_name], large_profile_image_url)
  end
end
