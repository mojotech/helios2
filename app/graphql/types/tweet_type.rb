class Types::TweetType < Types::BaseObject
  graphql_name "MojoTweet"

  field "created_at", String
  field "text", String
  field "retweet_count", Integer
  field "favorite_count", Integer
end
