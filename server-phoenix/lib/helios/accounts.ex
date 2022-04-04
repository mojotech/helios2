defmodule Helios.Accounts do
  @moduledoc """
  The Accounts context.
  """

  import Ecto.Query, warn: false
  alias Helios.Repo

  alias Helios.Accounts.{AdminUser, AdminUserToken}

  ## Database getters

  @doc """
  Gets a admin_user by email.

  ## Examples

      iex> get_admin_user_by_email("foo@example.com")
      %AdminUser{}

      iex> get_admin_user_by_email("unknown@example.com")
      nil

  """
  def get_admin_user_by_email(email) when is_binary(email) do
    Repo.get_by(AdminUser, email: email)
  end

  @doc """
  Gets a admin_user by email and password.

  ## Examples

      iex> get_admin_user_by_email_and_password("foo@example.com", "correct_password")
      %AdminUser{}

      iex> get_admin_user_by_email_and_password("foo@example.com", "invalid_password")
      nil

  """
  def get_admin_user_by_email_and_password(email, password)
      when is_binary(email) and is_binary(password) do
    admin_user = Repo.get_by(AdminUser, email: email)
    if AdminUser.valid_password?(admin_user, password), do: admin_user
  end

  @doc """
  Gets a single admin_user.

  Raises `Ecto.NoResultsError` if the AdminUser does not exist.

  ## Examples

      iex> get_admin_user!(123)
      %AdminUser{}

      iex> get_admin_user!(456)
      ** (Ecto.NoResultsError)

  """
  def get_admin_user!(id), do: Repo.get!(AdminUser, id)

  ## Admin user registration

  @doc """
  Registers a admin_user.

  ## Examples

      iex> register_admin_user(%{field: value})
      {:ok, %AdminUser{}}

      iex> register_admin_user(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def register_admin_user(attrs) do
    %AdminUser{}
    |> AdminUser.registration_changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates the admin_user password.

  ## Examples

      iex> update_admin_user_password(admin_user, "valid password", %{password: ...})
      {:ok, %AdminUser{}}

      iex> update_admin_user_password(admin_user, "invalid password", %{password: ...})
      {:error, %Ecto.Changeset{}}

  """
  def update_admin_user_password(admin_user, password, attrs) do
    changeset =
      admin_user
      |> AdminUser.password_changeset(attrs)
      |> AdminUser.validate_current_password(password)

    Ecto.Multi.new()
    |> Ecto.Multi.update(:admin_user, changeset)
    |> Ecto.Multi.delete_all(
      :tokens,
      AdminUserToken.admin_user_and_contexts_query(admin_user, :all)
    )
    |> Repo.transaction()
    |> case do
      {:ok, %{admin_user: admin_user}} -> {:ok, admin_user}
      {:error, :admin_user, changeset, _} -> {:error, changeset}
    end
  end

  ## Session

  @doc """
  Generates a session token.
  """
  def generate_admin_user_session_token(admin_user) do
    {token, admin_user_token} = AdminUserToken.build_session_token(admin_user)
    Repo.insert!(admin_user_token)
    token
  end

  @doc """
  Gets the admin_user with the given signed token.
  """
  def get_admin_user_by_session_token(token) do
    {:ok, query} = AdminUserToken.verify_session_token_query(token)
    Repo.one(query)
  end

  @doc """
  Deletes the signed token with the given context.
  """
  def delete_session_token(token) do
    Repo.delete_all(AdminUserToken.token_and_context_query(token, "session"))
    :ok
  end
end
