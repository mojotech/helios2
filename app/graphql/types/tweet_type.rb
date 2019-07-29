class Types::UserType < Types::BaseObject
  graphql_name "TweetUser"

  field "name", String
  field "handle", String
  field "avatar", String
end

class Types::InteractionType < Types::BaseObject
  graphql_name "TweetInteraction"

  field "retweet_count", Integer
  field "favorite_count", Integer
end

class Types::MediaType < Types::BaseObject
  graphql_name "TweetMedia"

  field "image", String, null: true
  field "link", String, null: true
end

class Types::TweetType < Types::BaseObject
  graphql_name "MojoTweet"

  field "status", String
  field "created_at", String
  field "text", String
  field "interactions", Types::InteractionType
  field "media", Types::MediaType, null: true
  field "user", Types::UserType
end
