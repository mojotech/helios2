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

Location.find_or_initialize_by(
  city_name: 'Boulder'
) do |r|
  r.latitude = 40.014986
  r.longitude = -105.270546
  r.time_zone = 'America/Denver'
  r.wifi_name = 'mojotech-guest'
  r.wifi_password = 'p@ssw0rd'
end.save!

Location.find_or_initialize_by(
  city_name: 'DC'
) do |r|
  r.latitude = 38.907192
  r.longitude = -77.036871
  r.time_zone = 'America/New_York'
end.save!

Location.find_or_initialize_by(
  city_name: 'NYC'
) do |r|
  r.latitude = 40.712775
  r.longitude = -74.005973
  r.time_zone = 'America/New_York'
end.save!

Location.find_or_initialize_by(
  city_name: 'San Diego'
) do |r|
  r.latitude = 32.7157
  r.longitude = -117.1611
  r.time_zone = 'America/Los_Angeles'
end.save!

primary_location = Location.find_by(city_name: ENV['PRIMARY_CITY_NAME'])
Widget.find_or_initialize_by(
  name: "Guests"
) do |r|
  r.enabled = false
  r.duration_seconds = 20
  r.position = 0
  r.sidebar_text = 'Guests'
  r.show_weather = false
  r.location = primary_location
end.save!

Widget.find_or_initialize_by(
  name: "Weather"
) do |r|
  r.enabled = true
  r.duration_seconds = 20
  r.position = 1
  r.sidebar_text = 'Weather'
  r.show_weather = false
  r.location = primary_location
end.save!

Widget.find_or_initialize_by(
  name: "Twitter"
) do |r|
  r.enabled = true
  r.duration_seconds = 20
  r.position = 2
  r.sidebar_text = '@MojoTech'
  r.show_weather = true
  r.location = primary_location
end.save!

Widget.find_or_initialize_by(
  name: "Numbers"
) do |r|
  r.enabled = true
  r.duration_seconds = 20
  r.position = 3
  r.sidebar_text = 'MojoTech by the Numbers'
  r.show_weather = true
  r.location = primary_location
end.save!

Widget.find_or_initialize_by(
  name: "Traffic"
) do |r|
  r.enabled = true
  r.duration_seconds = 20
  r.position = 4
  r.sidebar_text = 'Traffic'
  r.show_weather = true
  r.start = Tod::TimeOfDay("16:00")
  r.stop = Tod::TimeOfDay("23:00")
  r.location = primary_location
end.save!

TrafficCam.find_or_initialize_by(
  title: "I-95 at Broad St"
) do |r|
  r.url = "http://www.dot.ri.gov/img/travel/camimages/95-21%20I-95%20S%20@%20Broad%20St%20.jpg"
  r.location = providence
end.save!

TrafficCam.find_or_initialize_by(
  title: "I-95 at Lonsdale"
) do |r|
  r.url = "http://www.dot.ri.gov/img/travel/camimages/95-26%20I-95%20N%20@%20Lonsdale%20Ave.jpg"
  r.location = providence
end.save!

TrafficCam.find_or_initialize_by(
  title: "I-95 at Kinsley"
) do |r|
  r.url = "http://www.dot.ri.gov/img/travel/camimages/95-22b%20I-95%20N%20@%20Kinsley%20Ave.jpg"
  r.location = providence
end.save!

TrafficCam.find_or_initialize_by(
  title: "Exit 10 (near I-295)"
) do |r|
  r.url = "http://www.dot.ri.gov/img/travel/camimages/95-11%20I-95%20N%20@%20Toll%20Gate%20Rd.jpg"
  r.location = providence
end.save!

TrafficCam.find_or_initialize_by(
  title: "I-95 I-195 Split"
) do |r|
  r.url = "http://www.dot.ri.gov/img/travel/camimages/195-1%20I-195%20W%20Split%20@%20I-95.jpg"
  r.location = providence
end.save!

TrafficCam.find_or_initialize_by(
  title: "Dean Street"
) do |r|
  r.url = "https://www.dot.ri.gov/img/travel/camimages/6-1%20Rt%206%20E%20%20%2010%20N%20@%20Dean%20St.jpg"
  r.location = providence
end.save!
