class Types::UTCDateTimeType < GraphQL::Schema::Scalar
  def self.coerce_result(value, _ctx)
    Time.at(value).utc
  end
end

class Types::AnnouncementType < Types::BaseObject
  graphql_name "Announcement"

  field "id", ID
  field "publish_on", Types::UTCDateTimeType
  field "message", String
  field "people", String
  field "company", String
  field "announcement_id", String
  field "location_id", String
end
