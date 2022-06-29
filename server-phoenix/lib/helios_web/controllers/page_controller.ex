defmodule HeliosWeb.PageController do
  use HeliosWeb, :controller

  def index(conn, _params) do
    oauth_google_url = ElixirAuthGoogle.generate_oauth_url(conn)
    file = File.read!("priv/static/index.html")

    in_path = conn.request_path in ["/Boulder", "/Providence"]

    if in_path do
      html(conn, file)
    else
      render(conn, "index.html", oauth_google_url: oauth_google_url)
    end
  end
end
