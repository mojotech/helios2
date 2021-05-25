require 'rails_helper'
require 'twitter'

TIMELINEDATA = [Twitter::Tweet.new(
  created_at: "Fri Jun 28 18:01:35 +0000 2019",
  id: 1_144_667_173_547_315_200,
  full_text: "Spending the afternoon with our friends at @HumaneBoulder! https://t.co/yLhgWBhExT",
  entities: { urls: [] },
  user: {
    id: 38_696_559,
    name: "MojoTech",
    screen_name: "MojoTech",
    profile_image_url: "https://pbs.twimg.com/profile_images/775765308514660352/r1OvXiwV_normal.jpg"
  },
  extended_entities: {
    media: [
      {
        id: 114_466_717_354_731_520_0,
        media_url: "http://pbs.twimg.com/media/D-KsunCW4AA7uz8.jpg",
        expanded_url: "https://twitter.com/MojoTech/status/1144667173547315200/photo/1",
        type: "photo"
      }
    ]
  },
  retweet_count: 0,
  favorite_count: 0,
  retweeted: false,
  is_quote_status: false
)].freeze

SEARCHDATA = [].freeze

USERDATA = Twitter::User.new(
  id: 38_696_559,
  name: "MojoTech",
  screen_name: "MojoTech",
  profile_image_url_https: "https://pbs.twimg.com/profile_images/775765308514660352/r1OvXiwV.jpg"
).freeze

describe Helios2Schema do
  let(:context) { {} }
  let(:variables) { {} }

  before {
    expect_any_instance_of(Twitter::REST::Client).to receive(:user_timeline) { TIMELINEDATA }
  }

  let(:result) {
    res = Helios2Schema.execute(
      query_string,
      context: context,
      variables: variables
    )
    raise res["errors"].to_s if res["errors"]

    res
  }

  describe "a twitter query" do
    # provide a query string for `result`
    let(:query_string) {
      %(
{
  tweets{
    status
    createdAt
    text
    interactions{
      favoriteCount
      retweetCount
    }
    media{
      images {
        id
        mediaUrl
      }
      link
    }
    user{
      avatar
      handle
      name
    }
  }
}
      )
    }

    context 'from anonymous' do
      it 'will return a tweet query' do
        tweets = result["data"]["tweets"]
        expect(tweets.count).to eq(1)
      end

      it 'will return a query with valid data' do
        latest = result["data"]["tweets"].first
        expect(latest["status"]).to eq("normal")
        expect(latest["createdAt"]).to eq("2019-06-28T18:01:35Z")
        expect(latest["text"]).to eq("Spending the afternoon with our friends at @HumaneBoulder! ")
      end

      it 'will return valid stats' do
        interactions = result["data"]["tweets"].first["interactions"]
        expect(interactions["favoriteCount"]).to eq(0)
        expect(interactions["retweetCount"]).to eq(0)
      end

      it 'will return valid media data' do
        media = result["data"]["tweets"].first["media"]
        expect(media["images"].first["id"]).to eq(114_466_717_354_731_520_0)
        expect(media["images"].first["mediaUrl"]).to eq("http://pbs.twimg.com/media/D-KsunCW4AA7uz8.jpg")
        expect(media["link"]).to eq(nil)
      end

      it 'will return valid user data' do
        user = result["data"]["tweets"].first["user"]
        expect(user["avatar"]).to eq("https://pbs.twimg.com/profile_images/775765308514660352/r1OvXiwV.jpg")
        expect(user["handle"]).to eq("MojoTech")
        expect(user["name"]).to eq("MojoTech")
      end
    end
  end
end
