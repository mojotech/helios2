class Types::WidgetType < Types::BaseObject
  graphql_name "Widget"

  field "id", ID
  field "text", String
  field "isActive", Boolean
end
