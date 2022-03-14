# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Helios.Repo.insert!(%Helios.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.
alias Helios.{Repo, Location, Widget, TrafficCam}
alias HeliosWeb.Schema.Helpers.Ecto, as: EctoHelpers

providence =
  EctoHelpers.find_or_initialize_by(Location, [city_name: "Providence"], %Location{
    latitude: 41.823989,
    longitude: -71.412834,
    time_zone: "America/New_York",
    wifi_name: "mojotech-guest",
    wifi_password: "p@ssw0rd",
    bathroom_code: "0000*"
  })

boulder =
  EctoHelpers.find_or_initialize_by(Location, [city_name: "Boulder"], %Location{
    latitude: 40.014986,
    longitude: -105.270546,
    time_zone: "America/Denver",
    wifi_name: "mojotech-guest",
    wifi_password: "p@ssw0rd",
    bathroom_code: "0000*"
  })

EctoHelpers.find_or_initialize_by(Location, [city_name: "San Diego"], %Location{
  latitude: 32.7157,
  longitude: -117.1611,
  time_zone: "America/Los_Angeles"
})

Repo.all(Location)
|> Enum.each(fn location ->
  EctoHelpers.find_or_initialize_by(Widget, [name: "Guests", location_id: location.id], %Widget{
    enabled: false,
    duration_seconds: 20,
    position: 0,
    sidebar_text: "Guests",
    show_weather: false
  })
  EctoHelpers.find_or_initialize_by(Widget, [name: "Weather", location_id: location.id], %Widget{
    enabled: true,
    duration_seconds: 20,
    position: 1,
    sidebar_text: "Weather",
    show_weather: false
  })
  EctoHelpers.find_or_initialize_by(Widget, [name: "Twitter", location_id: location.id], %Widget{
    enabled: true,
    duration_seconds: 20,
    position: 2,
    sidebar_text: "@MojoTech",
    show_weather: true
  })
  EctoHelpers.find_or_initialize_by(Widget, [name: "Numbers", location_id: location.id], %Widget{
    enabled: true,
    duration_seconds: 20,
    position: 3,
    sidebar_text: "MojoTech by the Numbers",
    show_weather: true
  })
  EctoHelpers.find_or_initialize_by(Widget, [name: "Traffic", location_id: location.id], %Widget{
    enabled: true,
    duration_seconds: 20,
    position: 4,
    sidebar_text: "Traffic",
    show_weather: true,
    start: Time.from_iso8601!("16:00:00"),
    stop: Time.from_iso8601!("23:00:00")
  })
  EctoHelpers.find_or_initialize_by(Widget, [name: "Events", location_id: location.id], %Widget{
    enabled: true,
    duration_seconds: 20,
    position: 5,
    sidebar_text: "Events at MojoTech",
    show_weather: true
  })
end)

EctoHelpers.find_or_initialize_by(TrafficCam, [title: "I-95 at Broad St"], %TrafficCam{
  url: "http://www.dot.ri.gov/img/travel/camimages/95-21%20I-95%20S%20@%20Broad%20St%20.jpg",
  location: providence,
  feed_format: "image"
})

EctoHelpers.find_or_initialize_by(TrafficCam, [title: "I-95 at Lonsdale"], %TrafficCam{
  url: "http://www.dot.ri.gov/img/travel/camimages/95-26%20I-95%20N%20@%20Lonsdale%20Ave.jpg",
  location: providence,
  feed_format: "image"
})

EctoHelpers.find_or_initialize_by(TrafficCam, [title: "I-95 at Kinsley"], %TrafficCam{
  url: "http://www.dot.ri.gov/img/travel/camimages/95-22b%20I-95%20N%20@%20Kinsley%20Ave.jpg",
  location: providence,
  feed_format: "image"
})

EctoHelpers.find_or_initialize_by(TrafficCam, [title: "Exit 10 (near I-295)"], %TrafficCam{
  url: "http://www.dot.ri.gov/img/travel/camimages/95-11%20I-95%20N%20@%20Toll%20Gate%20Rd.jpg",
  location: providence,
  feed_format: "image"
})

EctoHelpers.find_or_initialize_by(TrafficCam, [title: "I-95 I-195 Split"], %TrafficCam{
  url: "http://www.dot.ri.gov/img/travel/camimages/195-1%20I-195%20W%20Split%20@%20I-95.jpg",
  location: providence,
  feed_format: "image"
})

EctoHelpers.find_or_initialize_by(TrafficCam, [title: "Dean Street"], %TrafficCam{
  url: "https://www.dot.ri.gov/img/travel/camimages/6-1%20Rt%206%20E%20%20%2010%20N%20@%20Dean%20St.jpg",
  location: providence,
  feed_format: "image"
})

EctoHelpers.find_or_initialize_by(TrafficCam, [title: "Broadway and Canyon"], %TrafficCam{
  url: "https://videostream.bouldercolorado.gov/live/smil:broadway_and_canyon.smil/playlist.m3u8",
  location: boulder,
  feed_format: "video"
})

EctoHelpers.find_or_initialize_by(TrafficCam, [title: "Foothills and Arapahoe"], %TrafficCam{
  url: "https://videostream.bouldercolorado.gov/live/smil:foothills_and_arapahoe.smil/playlist.m3u8",
  location: boulder,
  feed_format: "video"
})

EctoHelpers.find_or_initialize_by(TrafficCam, [title: "28th and Colorado"], %TrafficCam{
  url: "https://videostream.bouldercolorado.gov/live/smil:28th_and_colorado.smil/playlist.m3u8",
  location: boulder,
  feed_format: "video"
})

EctoHelpers.find_or_initialize_by(TrafficCam, [title: "28th and Iris"], %TrafficCam{
  url: "https://videostream.bouldercolorado.gov/live/smil:28th_and_iris.smil/playlist.m3u8",
  location: boulder,
  feed_format: "video"
})
