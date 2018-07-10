Rails.application.routes.draw do
  # rubocop:disable Style/IfUnlessModifier
  if Rails.env.development?
    mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"
  end
  # rubocop:enable Style/IfUnlessModifier
  post "/graphql", to: "graphql#execute"

  root to: 'pages#index'
end
