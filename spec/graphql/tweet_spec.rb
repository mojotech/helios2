require 'rails_helper'
require 'twitter'

TIMELINEDATA = [Twitter::Tweet.new(
  created_at: "Fri Jun 28 18:01:35 +0000 2019",
  id: 1_144_667_173_547_315_200,
  full_text: "Spending the afternoon with our friends at @HumaneBoulder! https://t.co/yLhgWBhExT",
  entities: { urls: [] },
  extended_entities: {
    media: [
      { id: 1_144_667_172_058_357_760,
        media_url: "http://pbs.twimg.com/media/D-KsunCW4AA7uz8.jpg",
        expanded_url: "https://twitter.com/MojoTech/status/1144667173547315200/photo/1",
        type: "photo" }
    ]
  },
  retweet_count: 0,
  favorite_count: 0
)].freeze

SEARCHDATA = [].freeze

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
    createdAt
    favoriteCount
    retweetCount
    text
    link
    media
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
        expect(latest["createdAt"]).to eq("2019-06-28 18:01:35 UTC")
        expect(latest["text"]).to eq("Spending the afternoon with our friends at @HumaneBoulder! ")
        expect(latest["favoriteCount"]).to eq(0)
        expect(latest["retweetCount"]).to eq(0)
        expect(latest["media"]).to eq("http://pbs.twimg.com/media/D-KsunCW4AA7uz8.jpg")
        expect(latest["link"]).to eq(nil)
      end
    end
  end
end
