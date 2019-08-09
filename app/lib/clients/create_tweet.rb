# Polls weather for subscribed locations
class Clients::CreateTweet
  delegate :text, :media, :interactions, :status, :user, :created_at, to: :@tweet

  InteractionQuery = Struct.new(:favorite_count, :retweet_count)

  MediaQuery = Struct.new(:images, :link)

  UserQuery = Struct.new(:name, :handle, :avatar)

  def initialize(tweet)
    @tweet = tweet
  end

  def attributes
    if status == 'retweet'
      @tweet.attrs[:retweeted_status]
    elsif status == 'quote'
      @tweet.attrs[:quoted_status]
    else
      @tweet.attrs
    end
  end

  def created_at
    @tweet.created_at
  end

  def media
    MediaQuery.new(images, link)
  end

  def images
    attributes[:extended_entities][:media].map { |item|
      item[:media_url]
    }
  rescue StandardError
    nil
  end

  def link
    attributes[:entities][:urls].first[:expanded_url]
  rescue StandardError
    nil
  end

  def interactions
    InteractionQuery.new(attributes[:favorite_count], attributes[:retweet_count])
  end

  def text
    text = attributes[:full_text]
    links = text.split(/\s|\n/).select { |word| word.include? "http" }
    clean_text = text
    links.each do |l|
      clean_text = clean_text.gsub(l, "")
    end
    clean_text
  end

  def status
    if @tweet.attrs[:retweeted_status]
      "retweet"
    elsif @tweet.attrs[:quoted_status]
      "quote"
    else
      "normal"
    end
  end

  def user
    user = attributes[:user]
    # removing '_normal' from url given returns orginal sized picture
    large_profile_image_url = user[:profile_image_url].remove("_normal")
    UserQuery.new(user[:name], user[:screen_name], large_profile_image_url)
  end
end
