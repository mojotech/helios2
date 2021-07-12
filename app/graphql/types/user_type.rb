class Types::UserType < Types::BaseObject
  graphql_name "User"

  field "user_name", String
  field "public_key", String
end
