providence = Location.find_or_initialize_by(
  city_name: 'Providence'
) do |r|
  r.latitude = 41.823989
  r.longitude = -71.412834
  r.time_zone = 'America/New_York'
end
providence.save!

Location.find_or_initialize_by(
  city_name: 'Boulder'
) do |r|
  r.latitude = 40.014986
  r.longitude = -105.270546
  r.time_zone = 'America/Denver'
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

Widget.find_or_initialize_by(
  name: "Guests"
) do |r|
  r.enabled = false
  r.duration_seconds = 20
  r.position = 0
  r.location_id = Location.find_by(city_name: ENV['PRIMARY_CITY_NAME']).id
end.save!

Widget.find_or_initialize_by(
  name: "Weather"
) do |r|
  r.enabled = true
  r.duration_seconds = 20
  r.position = 1
  r.location_id = Location.find_by(city_name: ENV['PRIMARY_CITY_NAME']).id
end.save!

Widget.find_or_initialize_by(
  name: "Twitter"
) do |r|
  r.enabled = false
  r.duration_seconds = 20
  r.position = 2
  r.location_id = Location.find_by(city_name: ENV['PRIMARY_CITY_NAME']).id
end.save!

Widget.find_or_initialize_by(
  name: "Numbers"
) do |r|
  r.enabled = true
  r.duration_seconds = 20
  r.position = 3
  r.location_id = Location.find_by(city_name: ENV['PRIMARY_CITY_NAME']).id
end.save!

TrafficCam.find_or_initialize_by(
  title: "I-95 at Broad St"
) do |r|
  r.url = "http://www.dot.ri.gov/img/travel/camimages/95-21%20I-95%20S%20@%20Broad%20St%20.jpg"
  r.location_id = providence.id
end.save!

TrafficCam.find_or_initialize_by(
  title: "I-95 at Lonsdale"
) do |r|
  r.url = "http://www.dot.ri.gov/img/travel/camimages/95-26%20I-95%20N%20@%20Lonsdale%20Ave.jpg"
  r.location_id = providence.id
end.save!

TrafficCam.find_or_initialize_by(
  title: "I-95 at Kinsley"
) do |r|
  r.url = "http://www.dot.ri.gov/img/travel/camimages/95-22b%20I-95%20N%20@%20Kinsley%20Ave.jpg"
  r.location_id = providence.id
end.save!

TrafficCam.find_or_initialize_by(
  title: "Exit 10 (near I-295)"
) do |r|
  r.url = "http://www.dot.ri.gov/img/travel/camimages/95-11%20I-95%20N%20@%20Toll%20Gate%20Rd.jpg"
  r.location_id = providence.id
end.save!

TrafficCam.find_or_initialize_by(
  title: "I-95 I-195 Split"
) do |r|
  r.url = "http://www.dot.ri.gov/img/travel/camimages/195-1%20I-195%20W%20Split%20@%20I-95.jpg"
  r.location_id = providence.id
end.save!

TrafficCam.find_or_initialize_by(
  title: "Tobey Street"
) do |r|
  r.url = "http://www.dot.ri.gov/img/travel/camimages/6-2%20Rt%206%20E%20%20%2010%20N%20@%20Tobey%20St.jpg"
  r.location_id = providence.id
end.save!
