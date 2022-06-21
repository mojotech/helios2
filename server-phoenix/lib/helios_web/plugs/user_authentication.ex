defmodule HeliosWeb.Plugs.UserAuthentication do
  import Plug.Conn
  alias Helios.User
  alias Helios.Repo

  def init(default), do: default

  def call(conn, _default) do
    # To verify that data was signed by a particular party, you must have the following information:
    #
    #    The public key of the party that signed the data.
    user_public_key = get_user_name(conn) |> get_public_key(conn)

    #
    #    The digital signature.
    [encoded_signature] = get_signature(conn)

    #
    #    The data that was signed.
    signed_data = conn.assigns.raw_body

    #
    #    Now, authenticate the signature:
    case Base.decode64(encoded_signature) do
      :error ->
        send_resp(conn, 400, "Bad Request") |> halt()

      {:ok, decoded_signature} ->
        authenticate_signature(decoded_signature, signed_data, user_public_key, conn)
    end
  end

  defp authenticate_signature(signature, message, public_key, conn) do
    [key_entry] = :public_key.pem_decode(public_key)
    public_key = :public_key.pem_entry_decode(key_entry)

    is_valid =
      :public_key.verify(
        message,
        :sha256,
        signature,
        public_key
      )

    if is_valid do
      conn
    else
      send_resp(conn, 401, "Unauthorized") |> halt()
    end
  end

  defp get_user_name(conn) do
    user_name = conn.body_params["author"]

    check_req_validity(user_name, conn)
  end

  defp get_public_key(user_name, conn) do
    user_public_key =
      User
      |> User.get_key_for_user(user_name)
      |> Repo.one()

    check_req_validity(user_public_key, conn)
  end

  defp get_signature(conn) do
    http_auth_header = get_req_header(conn, "http-auth")

    check_req_validity(http_auth_header, conn)
  end

  defp check_req_validity(req_field, conn) do
    if is_nil(req_field) || req_field == [] do
      send_resp(conn, 400, "Bad Request") |> halt()
    else
      req_field
    end
  end
end
