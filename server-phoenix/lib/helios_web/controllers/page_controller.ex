defmodule HeliosWeb.PageController do
  use HeliosWeb, :controller

  def index(conn, _params) do
    file = File.read!("priv/static/index.html")
    html(conn, file)
  end
end
