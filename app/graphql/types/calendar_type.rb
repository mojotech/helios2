Types::CalendarTime = GraphQL::ObjectType.define do
  name "CalendarTime"
  field "dateTime", !Types::UnixDateTimeType do
    resolve ->(obj, _, _) { obj.date_time }
  end
end

Types::CalendarEvent = GraphQL::ObjectType.define do
  name "CalendarEvent"
  field "summary", !types.String
  field "start", !Types::CalendarTime
  field "id", !types.String
end

Types::CalendarType = GraphQL::ObjectType.define do
  name "Calendar"
  field "items", !types[Types::CalendarEvent]
end
