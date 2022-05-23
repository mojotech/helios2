class Types::TrafficCamType < Types::BaseObject
  graphql_name "TrafficCam"

  field "id", ID
  field "title", String
  field "url", String
  field "feed_format", String
end
