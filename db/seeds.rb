def update_or_new!(klass, attributes)
  my_record = klass.find_by(attributes) || klass.new(attributes)
  yield(my_record)
  my_record.save!
  my_record
end

providence = update_or_new!(Location, city_name: 'Providence') do |r|
  r.latitude = 41.823989
  r.longitude = -71.412834
  r.time_zone = 'America/New_York'
  r.wifi_name = 'mojotech-guest'
  r.wifi_password = 'p@ssw0rd'
  r.bathroom_code = '0000*'
end

boulder = update_or_new!(Location, city_name: 'Boulder') do |r|
  r.latitude = 40.014986
  r.longitude = -105.270546
  r.time_zone = 'America/Denver'
  r.wifi_name = 'mojotech-guest'
  r.wifi_password = 'p@ssw0rd'
end

update_or_new!(Location, city_name: 'San Diego') do |r|
  r.latitude = 32.7157
  r.longitude = -117.1611
  r.time_zone = 'America/Los_Angeles'
end

Location.all.each do |location|
  update_or_new!(Widget, name: "Guests", location: location) do |r|
    r.enabled = false
    r.duration_seconds = 20
    r.position = 0
    r.sidebar_text = 'Guests'
    r.show_weather = false
  end

  update_or_new!(Widget, name: "Weather", location: location) do |r|
    r.enabled = true
    r.duration_seconds = 20
    r.position = 1
    r.sidebar_text = 'Weather'
    r.show_weather = false
  end

  update_or_new!(Widget, name: "Twitter", location: location) do |r|
    r.enabled = true
    r.duration_seconds = 20
    r.position = 2
    r.sidebar_text = '@MojoTech'
    r.show_weather = true
  end

  update_or_new!(Widget, name: "Numbers", location: location) do |r|
    r.enabled = true
    r.duration_seconds = 20
    r.position = 3
    r.sidebar_text = 'MojoTech by the Numbers'
    r.show_weather = true
  end

  update_or_new!(Widget, name: "Traffic", location: location) do |r|
    r.enabled = true
    r.duration_seconds = 20
    r.position = 4
    r.sidebar_text = 'Traffic'
    r.show_weather = true
    r.start = Tod::TimeOfDay("16:00")
    r.stop = Tod::TimeOfDay("23:00")
  end

  update_or_new!(Widget, name: "Events", location: location) do |r|
    r.enabled = true
    r.duration_seconds = 20
    r.position = 5
    r.sidebar_text = 'Events at MojoTech'
    r.show_weather = true
  end
end

# Seed Providence traffic cam images

update_or_new!(TrafficCam, title: "I-95 at Broad St") do |r|
  r.url = "http://www.dot.ri.gov/img/travel/camimages/95-21%20I-95%20S%20@%20Broad%20St%20.jpg"
  r.location = providence
  r.feed_format = "image"
end

update_or_new!(TrafficCam, title: "I-95 at Lonsdale") do |r|
  r.url = "http://www.dot.ri.gov/img/travel/camimages/95-26%20I-95%20N%20@%20Lonsdale%20Ave.jpg"
  r.location = providence
  r.feed_format = "image"
end

update_or_new!(TrafficCam, title: "I-95 at Kinsley") do |r|
  r.url = "http://www.dot.ri.gov/img/travel/camimages/95-22b%20I-95%20N%20@%20Kinsley%20Ave.jpg"
  r.location = providence
  r.feed_format = "image"
end

update_or_new!(TrafficCam, title: "Exit 10 (near I-295)") do |r|
  r.url = "http://www.dot.ri.gov/img/travel/camimages/95-11%20I-95%20N%20@%20Toll%20Gate%20Rd.jpg"
  r.location = providence
  r.feed_format = "image"
end

update_or_new!(TrafficCam, title: "I-95 I-195 Split") do |r|
  r.url = "http://www.dot.ri.gov/img/travel/camimages/195-1%20I-195%20W%20Split%20@%20I-95.jpg"
  r.location = providence
  r.feed_format = "image"
end

update_or_new!(TrafficCam, title: "Dean Street") do |r|
  r.url = "https://www.dot.ri.gov/img/travel/camimages/6-1%20Rt%206%20E%20%20%2010%20N%20@%20Dean%20St.jpg"
  r.location = providence
  r.feed_format = "image"
end

TrafficCam.where(
  title: "Tobey Street"
).destroy_all

# Seed Boulder traffic cam live-feeds

update_or_new!(TrafficCam, title: "Broadway and Canyon") do |r|
  r.url = "https://videostream.bouldercolorado.gov/live/smil:broadway_and_canyon.smil/playlist.m3u8"
  r.location = boulder
  r.feed_format = "video"
end

update_or_new!(TrafficCam, title: "Foothills and Arapahoe") do |r|
  r.url = "https://videostream.bouldercolorado.gov/live/smil:foothills_and_arapahoe.smil/playlist.m3u8"
  r.location = boulder
  r.feed_format = "video"
end

update_or_new!(TrafficCam, title: "28th and Colorado") do |r|
  r.url = "https://videostream.bouldercolorado.gov/live/smil:28th_and_colorado.smil/playlist.m3u8"
  r.location = boulder
  r.feed_format = "video"
end

update_or_new!(TrafficCam, title: "28th and Iris") do |r|
  r.url = "https://videostream.bouldercolorado.gov/live/smil:28th_and_iris.smil/playlist.m3u8"
  r.location = boulder
  r.feed_format = "video"
end

# Add random one-time events (will not be displayed on helios after this week)

update_or_new!(Event, external_id: "Tucker's final helios PR :(") do |r|
  r.source = 'github_pull'
  r.created_at = Date.parse('2021-10-6T10:09:08.07')
end

update_or_new!(Event, external_id: "PR: fix to allow multiple seedings") do |r|
  r.source = 'github_pull'
  r.created_at = Date.parse('2021-10-6T10:09:08.07')
end

update_or_new!(Event, external_id: "#the-five-interns-2021 channel message") do |r|
  r.source = 'slack_message'
  r.created_at = Date.parse('2021-10-6T10:09:08.07')
end

if AdminUser.count.zero?
  AdminUser.create!(
    email: ENV['ADMIN_EMAIL'],
    password: ENV['ADMIN_PASSWORD'],
    password_confirmation: ENV['ADMIN_PASSWORD']
  )
end
