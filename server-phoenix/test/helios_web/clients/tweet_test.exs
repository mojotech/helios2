defmodule HeliosWeb.Clients.TweetTest do
  use ExUnit.Case
  alias HeliosWeb.Clients.Tweet

  defp test_tweet_normal,
    do: %ExTwitter.Model.Tweet{
      favorited: false,
      in_reply_to_status_id: nil,
      retweeted: false,
      retweeted_status: nil,
      quoted_status: nil,
      source: "<a href=\"https://mobile.twitter.com\" rel=\"nofollow\">Twitter Web App</a>",
      coordinates: nil,
      matching_rules: [],
      id: 1_504_140_186_669_797_381,
      entities: %ExTwitter.Model.Entities{
        hashtags: [],
        media: [],
        polls: [],
        symbols: [],
        urls: [],
        user_mentions: []
      },
      text: "Hi everyone! This is my first tweet.",
      quoted_status_id: nil,
      quote_count: nil,
      reply_count: nil,
      withheld_copyright: nil,
      user: %ExTwitter.Model.User{
        inserted_at: "Wed Mar 16 14:57:07 +0000 2022",
        default_profile: true,
        default_profile_image: false,
        derived: nil,
        description: "",
        favourites_count: 0,
        followers_count: 0,
        friends_count: 1,
        id: 1_504_109_395_621_335_049,
        id_str: "1504109395621335049",
        listed_count: 0,
        location: "",
        name: "Lina Lim",
        profile_banner_url: nil,
        profile_image_url_https:
          "https://pbs.twimg.com/profile_images/1504109514672517132/GFIOCHmQ_normal.png",
        protected: false,
        screen_name: "MojoLinaLim",
        statuses_count: 2,
        url: nil,
        verified: false,
        withheld_in_countries: [],
        withheld_scope: nil
      },
      is_quote_status: false,
      retweet_count: 0,
      possibly_sensitive: nil,
      in_reply_to_user_id: nil,
      favorite_count: 0,
      scopes: nil,
      current_user_retweet: nil,
      inserted_at: "Wed Mar 16 16:59:00 +0000 2022",
      place: nil,
      full_text: nil,
      filter_level: nil,
      in_reply_to_status_id_str: nil,
      lang: "en",
      withheld_scope: nil,
      id_str: "1504140186669797381",
      truncated: false,
      in_reply_to_screen_name: nil,
      in_reply_to_user_id_str: nil,
      quoted_status_id_str: nil,
      withheld_in_countries: nil,
      extended_entities: nil
    }

  defp test_tweet_retweet,
    do: %ExTwitter.Model.Tweet{
      in_reply_to_user_id: nil,
      inserted_at: "Fri Mar 18 15:56:28 +0000 2022",
      source: "<a href=\"https://mobile.twitter.com\" rel=\"nofollow\">Twitter Web App</a>",
      reply_count: nil,
      withheld_scope: nil,
      id: 1_504_849_226_479_587_328,
      user: %ExTwitter.Model.User{
        inserted_at: "Wed Mar 16 14:57:07 +0000 2022",
        default_profile: true,
        default_profile_image: false,
        derived: nil,
        description: "",
        favourites_count: 0,
        followers_count: 0,
        friends_count: 1,
        id: 1_504_109_395_621_335_049,
        id_str: "1504109395621335049",
        listed_count: 0,
        location: "",
        name: "Lina Lim",
        profile_banner_url: nil,
        profile_image_url_https:
          "https://pbs.twimg.com/profile_images/1504109514672517132/GFIOCHmQ_normal.png",
        protected: false,
        screen_name: "MojoLinaLim",
        statuses_count: 3,
        url: nil,
        verified: false,
        withheld_in_countries: [],
        withheld_scope: nil
      },
      in_reply_to_status_id_str: nil,
      quoted_status_id: nil,
      in_reply_to_screen_name: nil,
      full_text: nil,
      filter_level: nil,
      text: "RT @MojoLinaLim: Hi everyone! This is my first tweet.",
      favorite_count: 0,
      is_quote_status: false,
      entities: %ExTwitter.Model.Entities{
        hashtags: [],
        media: [],
        polls: [],
        symbols: [],
        urls: [],
        user_mentions: [
          %ExTwitter.Model.UserMention{
            id: 1_504_109_395_621_335_049,
            id_str: "1504109395621335049",
            indices: [3, 15],
            name: "Lina Lim",
            screen_name: "MojoLinaLim"
          }
        ]
      },
      favorited: false,
      coordinates: nil,
      place: nil,
      lang: "en",
      retweeted_status: %ExTwitter.Model.Tweet{
        in_reply_to_user_id: nil,
        inserted_at: "Wed Mar 16 16:59:00 +0000 2022",
        source: "<a href=\"https://mobile.twitter.com\" rel=\"nofollow\">Twitter Web App</a>",
        reply_count: nil,
        withheld_scope: nil,
        id: 1_504_140_186_669_797_381,
        user: %ExTwitter.Model.User{
          inserted_at: "Wed Mar 16 14:57:07 +0000 2022",
          default_profile: true,
          default_profile_image: false,
          derived: nil,
          description: "",
          favourites_count: 0,
          followers_count: 0,
          friends_count: 1,
          id: 1_504_109_395_621_335_049,
          id_str: "1504109395621335049",
          listed_count: 0,
          location: "",
          name: "Lina Lim",
          profile_banner_url: nil,
          profile_image_url_https:
            "https://pbs.twimg.com/profile_images/1504109514672517132/GFIOCHmQ_normal.png",
          protected: false,
          screen_name: "MojoLinaLim",
          statuses_count: 3,
          url: nil,
          verified: false,
          withheld_in_countries: []
        },
        in_reply_to_status_id_str: nil,
        quoted_status_id: nil,
        in_reply_to_screen_name: nil,
        full_text: nil,
        filter_level: nil,
        text: "Hi everyone! This is my first tweet.",
        favorite_count: 0,
        is_quote_status: false,
        entities: %ExTwitter.Model.Entities{
          hashtags: [],
          media: [],
          polls: [],
          symbols: [],
          urls: [],
          user_mentions: []
        },
        favorited: false,
        coordinates: nil,
        place: nil,
        lang: "en",
        retweeted_status: nil,
        quoted_status_id_str: nil,
        withheld_copyright: nil,
        retweet_count: 1,
        withheld_in_countries: nil,
        possibly_sensitive: nil,
        current_user_retweet: nil,
        truncated: false
      },
      quoted_status_id_str: nil,
      withheld_copyright: nil,
      retweet_count: 1,
      withheld_in_countries: nil,
      possibly_sensitive: nil,
      current_user_retweet: nil,
      truncated: false,
      scopes: nil,
      quoted_status: nil,
      quote_count: nil,
      id_str: "1504849226479587328",
      in_reply_to_user_id_str: nil,
      matching_rules: [],
      extended_entities: nil,
      in_reply_to_status_id: nil,
      retweeted: true
    }

  test "from_api normal status" do
    assert Tweet.from_api(test_tweet_normal()) ===
             %HeliosWeb.Clients.Tweet{
               inserted_at: ~U[2022-03-16 16:59:00Z],
               interactions: %HeliosWeb.Clients.Tweet.InteractionQuery{
                 favorite_count: 0,
                 retweet_count: 0
               },
               media: %HeliosWeb.Clients.Tweet.MediaQuery{images: nil, link: nil},
               status: "normal",
               text: "Hi everyone! This is my first tweet.",
               user: %HeliosWeb.Clients.Tweet.UserQuery{
                 avatar: "https://pbs.twimg.com/profile_images/1504109514672517132/GFIOCHmQ.png",
                 handle: "MojoLinaLim",
                 name: "Lina Lim"
               }
             }
  end

  test "from_api retweet status" do
    assert Tweet.from_api(test_tweet_retweet()) ===
             %HeliosWeb.Clients.Tweet{
               inserted_at: ~U[2022-03-18 15:56:28Z],
               interactions: %HeliosWeb.Clients.Tweet.InteractionQuery{
                 favorite_count: 0,
                 retweet_count: 1
               },
               media: %HeliosWeb.Clients.Tweet.MediaQuery{images: nil, link: nil},
               status: "retweet",
               text: "RT @MojoLinaLim: Hi everyone! This is my first tweet.",
               user: %HeliosWeb.Clients.Tweet.UserQuery{
                 avatar: "https://pbs.twimg.com/profile_images/1504109514672517132/GFIOCHmQ.png",
                 handle: "MojoLinaLim",
                 name: "Lina Lim"
               }
             }
  end
end
