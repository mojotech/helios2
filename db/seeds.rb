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
  city_name: 'SanDiego'
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
    r.start = Tod::TimeOfDay("16:00")
    r.stop = Tod::TimeOfDay("23:00")
  end.save!
end

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
  title: "Tobey Street"
) do |r|
  r.url = "http://www.dot.ri.gov/img/travel/camimages/6-2%20Rt%206%20E%20%20%2010%20N%20@%20Tobey%20St.jpg"
  r.location = providence
end.save!
