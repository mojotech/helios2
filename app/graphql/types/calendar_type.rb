class Types::CalendarTime < Types::BaseObject
  field :dateTime, Types::UnixDateTimeType, method: :date_time
end

class Types::CalendarEvent < Types::BaseObject
  field :summary, String
  field :start, Types::CalendarTime
  field :id, String
end

class Types::CalendarType < Types::BaseObject
  field :items, [Types::CalendarEvent]
end
