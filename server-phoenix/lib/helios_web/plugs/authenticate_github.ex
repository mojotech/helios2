# Original source from here. MIT licensed
# https://github.com/emilsoman/gh_webhook_plug

defmodule HeliosWeb.Plugs.AuthenticateGithub do
  import Plug.Conn

  def init(default), do: default

  def call(conn, _default) do
    if conn.request_path != "web_hooks/github" do
      conn
    else
      {:ok, body, conn} = Plug.Conn.read_body(conn)
      secret = System.get_env("GITHUB_WEBHOOK_SECRET")
      [signature_in_header] = get_req_header(conn, "x-hub-signature")

      signature =
        "sha1=" <> (:crypto.mac(:hmac, :sha, secret, body) |> Base.encode16(case: :lower))

      result = Plug.Crypto.secure_compare(signature, signature_in_header)

      case result do
        true ->
          conn

        false ->
          conn
          |> send_resp(403, "Forbidden")
          |> halt()
      end
    end
  end
end
