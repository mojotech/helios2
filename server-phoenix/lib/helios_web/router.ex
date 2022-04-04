defmodule HeliosWeb.Router do
  use HeliosWeb, :router

  import HeliosWeb.AdminUserAuth

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, {HeliosWeb.LayoutView, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug :fetch_current_admin_user
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  use Kaffy.Routes,
    scope: "/admin",
    pipe_through: [:fetch_current_admin_user, :require_authenticated_admin_user]

  scope "/" do
    pipe_through(:api)
    forward "/graphql", Absinthe.Plug, schema: HeliosWeb.Schema

    forward("/graphiql", Absinthe.Plug.GraphiQL,
      schema: HeliosWeb.Schema,
      socket: HeliosWeb.UserSocket
    )
  end

  scope "/web_hooks", HeliosWeb.WebHooks do
    post("/github", GithubController, :handle)
    post("/slack", SlackController, :handle)

    post("/publish", PublishController, :handle)
  end

  # Other scopes may use custom stacks.
  # scope "/api", HeliosWeb do
  #   pipe_through :api
  # end

  # Enables LiveDashboard only for development
  #
  # If you want to use the LiveDashboard in production, you should put
  # it behind authentication and allow only admins to access it.
  # If your application does not have an admins-only section yet,
  # you can use Plug.BasicAuth to set up some basic authentication
  # as long as you are also using SSL (which you should anyway).
  if Mix.env() in [:dev, :test] do
    import Phoenix.LiveDashboard.Router

    scope "/" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: HeliosWeb.Telemetry
    end
  end

  # Enables the Swoosh mailbox preview in development.
  #
  # Note that preview only shows emails that were sent by the same
  # node running the Phoenix server.
  if Mix.env() == :dev do
    scope "/dev" do
      pipe_through :browser

      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end

  ## Authentication routes

  scope "/admin", HeliosWeb do
    pipe_through [:browser, :redirect_if_admin_user_is_authenticated]

    get "/login", AdminUserSessionController, :new
    post "/login", AdminUserSessionController, :create
  end

  scope "/admin", HeliosWeb do
    pipe_through [:browser]

    delete "/logout", AdminUserSessionController, :delete
  end
end
