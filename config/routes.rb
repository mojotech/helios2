Rails.application.routes.draw do
  # rubocop:disable Style/IfUnlessModifier
  if Rails.env.development?
    mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"
  end
  # rubocop:enable Style/IfUnlessModifier

  post "/graphql", to: "graphql#execute"

  namespace :web_hooks do
    post 'github', to: 'github#create', defaults: { format: :json }
    post 'slack_event', to: 'slack#create', defaults: { format: :json }

    get 'new_slack_auth', to: 'slack_auth#new'
    get 'create_slack_auth', to: 'slack_auth#create'
  end

  get "/svelte", to: 'pages#svelte'

  root to: 'pages#index'
end
