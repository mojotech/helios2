defmodule Helios.Accounts.AdminUserToken do
  use Ecto.Schema
  import Ecto.Query

  @hash_algorithm :sha256
  @rand_size 32

  # It is very important to keep the reset password token expiry short,
  # since someone with access to the email may take over the account.
  @reset_password_validity_in_days 1
  @confirm_validity_in_days 7
  @change_email_validity_in_days 7
  @session_validity_in_days 60

  schema "admin_users_tokens" do
    field :token, :binary
    field :context, :string
    field :sent_to, :string
    belongs_to :admin_user, Helios.Accounts.AdminUser, source: :admin_users_id

    timestamps(inserted_at: :created_at, type: :utc_datetime, updated_at: false)
  end

  @doc """
  Generates a token that will be stored in a signed place,
  such as session or cookie. As they are signed, those
  tokens do not need to be hashed.

  The reason why we store session tokens in the database, even
  though Phoenix already provides a session cookie, is because
  Phoenix' default session cookies are not persisted, they are
  simply signed and potentially encrypted. This means they are
  valid indefinitely, unless you change the signing/encryption
  salt.

  Therefore, storing them allows individual admin_user
  sessions to be expired. The token system can also be extended
  to store additional data, such as the device used for logging in.
  You could then use this information to display all valid sessions
  and devices in the UI and allow users to explicitly expire any
  session they deem invalid.
  """
  def build_session_token(admin_user) do
    token = :crypto.strong_rand_bytes(@rand_size)

    {token,
     %Helios.Accounts.AdminUserToken{
       token: token,
       context: "session",
       admin_user_id: admin_user.id
     }}
  end

  @doc """
  Checks if the token is valid and returns its underlying lookup query.

  The query returns the admin_user found by the token, if any.

  The token is valid if it matches the value in the database and it has
  not expired (after @session_validity_in_days).
  """
  def verify_session_token_query(token) do
    query =
      from token in token_and_context_query(token, "session"),
        join: admin_user in assoc(token, :admin_user),
        where: token.created_at > ago(@session_validity_in_days, "day"),
        select: admin_user

    {:ok, query}
  end

  @doc """
  Returns the token struct for the given token value and context.
  """
  def token_and_context_query(token, context) do
    from Helios.Accounts.AdminUserToken, where: [token: ^token, context: ^context]
  end

  @doc """
  Gets all tokens for the given admin_user for the given contexts.
  """
  def admin_user_and_contexts_query(admin_user, :all) do
    from t in Helios.Accounts.AdminUserToken, where: t.admin_user_id == ^admin_user.id
  end

  def admin_user_and_contexts_query(admin_user, [_ | _] = contexts) do
    from t in Helios.Accounts.AdminUserToken,
      where: t.admin_user_id == ^admin_user.id and t.context in ^contexts
  end
end
