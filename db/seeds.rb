providence = Location.create(
  latitude: 41.823989,
  longitude: -71.412834,
  city_name: 'Providence',
  time_zone: 'America/New_York'
)

Location.create(
  latitude: 40.014986,
  longitude: -105.270546,
  city_name: 'Boulder',
  time_zone: 'America/Denver'
)

Location.create(
  latitude: 38.907192,
  longitude: -77.036871,
  city_name: 'DC',
  time_zone: 'America/New_York'
)

Location.create(
  latitude: 40.712775,
  longitude: -74.005973,
  city_name: 'NYC',
  time_zone: 'America/New_York'
)

Widget.create(
  name: "Guests",
  enabled: false,
  duration_seconds: 20,
  position: 0
)

Widget.create(
  name: "Weather",
  enabled: true,
  duration_seconds: 20,
  position: 1
)

Widget.create(
  name: "Twitter",
  enabled: true,
  duration_seconds: 20,
  position: 2
)

Widget.create(
  name: "Numbers",
  enabled: true,
  duration_seconds: 20,
  position: 3
)

TrafficCam.create(
  title: "I-95 at Broad St",
  url: "http://www.dot.ri.gov/img/travel/camimages/95-21%20I-95%20S%20@%20Broad%20St%20.jpg",
  location_id: providence.id
)

TrafficCam.create(
  title: "I-95 at Lonsdale",
  url: "http://www.dot.ri.gov/img/travel/camimages/95-26%20I-95%20N%20@%20Lonsdale%20Ave.jpg",
  location_id: providence.id
)

TrafficCam.create(
  title: "I-95 at Kinsley",
  url: "http://www.dot.ri.gov/img/travel/camimages/95-22b%20I-95%20N%20@%20Kinsley%20Ave.jpg",
  location_id: providence.id
)

TrafficCam.create(
  title: "Exit 10 (near I-295)",
  url: "http://www.dot.ri.gov/img/travel/camimages/95-11%20I-95%20N%20@%20Toll%20Gate%20Rd.jpg",
  location_id: providence.id
)

TrafficCam.create(
  title: "I-95 I-195 Split",
  url: "http://www.dot.ri.gov/img/travel/camimages/195-1%20I-195%20W%20Split%20@%20I-95.jpg",
  location_id: providence.id
)

TrafficCam.create(
  title: "Tobey Street",
  url: "http://www.dot.ri.gov/img/travel/camimages/6-2%20Rt%206%20E%20%20%2010%20N%20@%20Tobey%20St.jpg",
  location_id: providence.id
)
