class Types::SubscriptionType < Types::BaseObject
  field :event_published, Types::EventType, description: "An event was published to the API"

  def event_published; end
end
