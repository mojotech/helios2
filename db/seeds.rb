providence = Location.find_or_initialize_by(
  city_name: 'Providence'
) do |r|
  r.latitude = 41.823989
  r.longitude = -71.412834
  r.time_zone = 'America/New_York'
  r.wifi_name = 'mojotech-guest'
  r.wifi_password = 'p@ssw0rd'
  r.bathroom_code = '0000*'
end
providence.save!

boulder = Location.find_or_initialize_by(
  city_name: 'Boulder'
) do |r|
  r.latitude = 40.014986
  r.longitude = -105.270546
  r.time_zone = 'America/Denver'
  r.wifi_name = 'mojotech-guest'
  r.wifi_password = 'p@ssw0rd'
end
boulder.save!

Location.find_or_initialize_by(
  city_name: 'San Diego'
) do |r|
  r.latitude = 32.7157
  r.longitude = -117.1611
  r.time_zone = 'America/Los_Angeles'
end.save!

Location.all.each do |location|
  Widget.find_or_initialize_by(
    name: "Guests",
    location: location
  ) do |r|
    r.enabled = false
    r.duration_seconds = 20
    r.position = 0
    r.sidebar_text = 'Guests'
    r.show_weather = false
  end.save!

  Widget.find_or_initialize_by(
    name: "Weather",
    location: location
  ) do |r|
    r.enabled = true
    r.duration_seconds = 20
    r.position = 1
    r.sidebar_text = 'Weather'
    r.show_weather = false
  end.save!

  Widget.find_or_initialize_by(
    name: "Twitter",
    location: location
  ) do |r|
    r.enabled = true
    r.duration_seconds = 20
    r.position = 2
    r.sidebar_text = '@MojoTech'
    r.show_weather = true
  end.save!

  Widget.find_or_initialize_by(
    name: "Numbers",
    location: location
  ) do |r|
    r.enabled = true
    r.duration_seconds = 20
    r.position = 3
    r.sidebar_text = 'MojoTech by the Numbers'
    r.show_weather = true
  end.save!

  Widget.find_or_initialize_by(
    name: "Traffic",
    location: location
  ) do |r|
    r.enabled = true
    r.duration_seconds = 20
    r.position = 4
    r.sidebar_text = 'Traffic'
    r.show_weather = true
    r.start = Tod::TimeOfDay.parse("16:00")
    r.stop = Tod::TimeOfDay.parse("23:00")
  end.save!

  Widget.find_or_initialize_by(
    name: "Events",
    location: location
  ) do |r|
    r.enabled = true
    r.duration_seconds = 20
    r.position = 5
    r.sidebar_text = 'Events at MojoTech'
    r.show_weather = true
  end.save!
end

TrafficCam.find_or_initialize_by(
  title: "I-95 at Broad St"
) do |r|
  r.url = "http://www.dot.ri.gov/img/travel/camimages/95-21%20I-95%20S%20@%20Broad%20St%20.jpg"
  r.location = providence
  r.feed_format = "image"
end.save!

TrafficCam.find_or_initialize_by(
  title: "I-95 at Lonsdale"
) do |r|
  r.url = "http://www.dot.ri.gov/img/travel/camimages/95-26%20I-95%20N%20@%20Lonsdale%20Ave.jpg"
  r.location = providence
  r.feed_format = "image"
end.save!

TrafficCam.find_or_initialize_by(
  title: "I-95 at Kinsley"
) do |r|
  r.url = "http://www.dot.ri.gov/img/travel/camimages/95-22b%20I-95%20N%20@%20Kinsley%20Ave.jpg"
  r.location = providence
  r.feed_format = "image"
end.save!

TrafficCam.find_or_initialize_by(
  title: "Exit 10 (near I-295)"
) do |r|
  r.url = "http://www.dot.ri.gov/img/travel/camimages/95-11%20I-95%20N%20@%20Toll%20Gate%20Rd.jpg"
  r.location = providence
  r.feed_format = "image"
end.save!

TrafficCam.find_or_initialize_by(
  title: "I-95 I-195 Split"
) do |r|
  r.url = "http://www.dot.ri.gov/img/travel/camimages/195-1%20I-195%20W%20Split%20@%20I-95.jpg"
  r.location = providence
  r.feed_format = "image"
end.save!

TrafficCam.find_or_initialize_by(
  title: "Broadway"
) do |r|
  r.url = "https://www.dot.ri.gov/img/travel/camimages/95-22%20I-95%20S%20@%20Broadway%20(Prov).jpg"
  r.location = providence
  r.feed_format = "image"
end.save!

TrafficCam.where(
  title: "Tobey Street"
).destroy_all

TrafficCam.find_or_initialize_by(
  title: "Broadway and Canyon"
) do |r|
  r.url = "https://videostream.bouldercolorado.gov/live/smil:broadway_and_canyon.smil/playlist.m3u8"
  r.location = boulder
  r.feed_format = "video"
end.save!

TrafficCam.find_or_initialize_by(
  title: "Foothills and Arapahoe"
) do |r|
  r.url = "https://videostream.bouldercolorado.gov/live/smil:foothills_and_arapahoe.smil/playlist.m3u8"
  r.location = boulder
  r.feed_format = "video"
end.save!

TrafficCam.find_or_initialize_by(
  title: "28th and Colorado"
) do |r|
  r.url = "https://videostream.bouldercolorado.gov/live/smil:28th_and_colorado.smil/playlist.m3u8"
  r.location = boulder
  r.feed_format = "video"
end.save!

TrafficCam.find_or_initialize_by(
  title: "28th and Iris"
) do |r|
  r.url = "https://videostream.bouldercolorado.gov/live/smil:28th_and_iris.smil/playlist.m3u8"
  r.location = boulder
  r.feed_format = "video"
end.save!

if AdminUser.count.zero?
  AdminUser.create!(
    email: ENV['ADMIN_EMAIL'],
    password: ENV['ADMIN_PASSWORD'],
    password_confirmation: ENV['ADMIN_PASSWORD']
  )
end
