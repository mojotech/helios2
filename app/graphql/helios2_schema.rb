Helios2Schema = GraphQL::Schema.define do
  mutation(Types::MutationType)
  query(Types::QueryType)
end
