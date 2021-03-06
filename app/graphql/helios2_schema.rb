class Helios2Schema < GraphQL::Schema
  use GraphQL::Subscriptions::ActionCableSubscriptions

  mutation(Types::MutationType)
  query(Types::QueryType)
  subscription(Types::SubscriptionType)

  orphan_types [
    Types::GuestsWidget,
    Types::WeatherWidget,
    Types::TwitterWidget,
    Types::NumbersWidget,
    Types::TrafficWidget,
    Types::EventsWidget
  ]
end
