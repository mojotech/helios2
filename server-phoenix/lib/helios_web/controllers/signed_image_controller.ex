defmodule HeliosWeb.SignedImageController do
  use HeliosWeb, :controller
  require Logger
  require JSON

  defp upload_bearer_token,
    do: Application.get_env(:helios, HeliosWeb.Endpoint)[:upload_bearer_token]

  def handle(conn, params) do
    signed_url = Helios.Avatar.url({params["uuid"], ""}, :thumb, signed: true)

    redirect(conn, external: signed_url)
  end
end
