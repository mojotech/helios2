defmodule HeliosWeb.Router do
  use HeliosWeb, :router

  pipeline :requires_auth do
    plug HeliosWeb.Plugs.UserAuthentication
  end

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, {HeliosWeb.LayoutView, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/admin", HeliosWeb.Admin, as: :admin do
    pipe_through :browser
    resources "/users", UserController
    resources "/developer_users", DeveloperUserController
    resources "/locations", LocationController
    resources "/events", EventController
    resources "/daily_event_summaries", DailyEventSummaryController
    resources "/announcements", AnnouncementController
    resources "/widgets", WidgetController
    resources "/traffic_cams", TrafficCamController
  end

  scope "/" do
    pipe_through(:api)
    forward "/graphql", Absinthe.Plug, schema: HeliosWeb.Schema

    forward("/graphiql", Absinthe.Plug.GraphiQL,
      schema: HeliosWeb.Schema,
      socket: HeliosWeb.AbsintheSocketDecorator
    )
  end

  scope "/web_hooks", HeliosWeb.WebHooks do
    post("/github", GithubController, :handle)
    post("/slack", SlackController, :handle)

    post("/publish", PublishController, :handle)
  end

  scope "/api/v:version/events", HeliosWeb.EventsAPI do
    pipe_through(:requires_auth)
    post("/", EventsAPIController, :handle)
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

  scope "/auth/google/callback", HeliosWeb do
    pipe_through :browser
    get("/", GoogleAuthController, :index)
  end

  scope "/", HeliosWeb do
    pipe_through :browser
    get("/*path", PageController, :index)
  end
end
