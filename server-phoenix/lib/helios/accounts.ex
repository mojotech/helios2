defmodule Helios.Accounts do
  @moduledoc """
  The Accounts context.
  """
  import Ecto.Query, warn: false
  alias Helios.Repo

  import Torch.Helpers, only: [sort: 1, paginate: 4, strip_unset_booleans: 3]
  import Filtrex.Type.Config

  alias Helios.Accounts.User
  alias Helios.Accounts.DeveloperUser

  @pagination [page_size: 15]
  @pagination_distance 5

  ########
  # USER #
  ########

  @doc """
  Paginate the list of users using filtrex
  filters.

  ## Examples

      iex> paginate_users(%{})
      %{users: [%User{}], ...}

  """
  @spec paginate_users(map) :: {:ok, map} | {:error, any}
  def paginate_users(params \\ %{}) do
    params =
      params
      |> strip_unset_booleans("user", [])
      |> Map.put_new("sort_direction", "desc")
      |> Map.put_new("sort_field", "inserted_at")

    {:ok, sort_direction} = Map.fetch(params, "sort_direction")
    {:ok, sort_field} = Map.fetch(params, "sort_field")

    with {:ok, filter} <- Filtrex.parse_params(filter_config(:users), params["user"] || %{}),
         %Scrivener.Page{} = page <- do_paginate_users(filter, params) do
      {:ok,
       %{
         users: page.entries,
         page_number: page.page_number,
         page_size: page.page_size,
         total_pages: page.total_pages,
         total_entries: page.total_entries,
         distance: @pagination_distance,
         sort_field: sort_field,
         sort_direction: sort_direction
       }}
    else
      {:error, error} -> {:error, error}
      error -> {:error, error}
    end
  end

  defp do_paginate_users(filter, params) do
    User
    |> Filtrex.query(filter)
    |> order_by(^sort(params))
    |> paginate(Repo, params, @pagination)
  end

  @doc """
  Returns the list of users.

  ## Examples

      iex> list_users()
      [%User{}, ...]

  """
  def list_users do
    Repo.all(User)
  end

  @doc """
  Gets a single user.

  Raises `Ecto.NoResultsError` if the User does not exist.

  ## Examples

      iex> get_user!(123)
      %User{}

      iex> get_user!(456)
      ** (Ecto.NoResultsError)

  """
  def get_user!(id), do: Repo.get!(User, id)

  @doc """
  Creates a user.

  ## Examples

      iex> create_user(%{field: value})
      {:ok, %User{}}

      iex> create_user(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_user(attrs \\ %{}) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a user.

  ## Examples

      iex> update_user(user, %{field: new_value})
      {:ok, %User{}}

      iex> update_user(user, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_user(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a User.

  ## Examples

      iex> delete_user(user)
      {:ok, %User{}}

      iex> delete_user(user)
      {:error, %Ecto.Changeset{}}

  """
  def delete_user(%User{} = user) do
    Repo.delete(user)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking user changes.

  ## Examples

      iex> change_user(user)
      %Ecto.Changeset{source: %User{}}

  """
  def change_user(%User{} = user, attrs \\ %{}) do
    User.changeset(user, attrs)
  end

  ##################
  # DEVELOPER USER #
  ##################

  @doc """
  Paginate the list of developer_users using filtrex
  filters.

  ## Examples

      iex> paginate_developer_users(%{})
      %{developer_users: [%DeveloperUser{}], ...}

  """
  @spec paginate_developer_users(map) :: {:ok, map} | {:error, any}
  def paginate_developer_users(params \\ %{}) do
    params =
      params
      |> strip_unset_booleans("developer_user", [])
      |> Map.put_new("sort_direction", "desc")
      |> Map.put_new("sort_field", "inserted_at")

    {:ok, sort_direction} = Map.fetch(params, "sort_direction")
    {:ok, sort_field} = Map.fetch(params, "sort_field")

    with {:ok, filter} <-
           Filtrex.parse_params(filter_config(:developer_users), params["developer_user"] || %{}),
         %Scrivener.Page{} = page <- do_paginate_developer_users(filter, params) do
      {:ok,
       %{
         developer_users: page.entries,
         page_number: page.page_number,
         page_size: page.page_size,
         total_pages: page.total_pages,
         total_entries: page.total_entries,
         distance: @pagination_distance,
         sort_field: sort_field,
         sort_direction: sort_direction
       }}
    else
      {:error, error} -> {:error, error}
      error -> {:error, error}
    end
  end

  defp do_paginate_developer_users(filter, params) do
    DeveloperUser
    |> Filtrex.query(filter)
    |> order_by(^sort(params))
    |> paginate(Repo, params, @pagination)
  end

  @doc """
  Returns the list of developer_users.

  ## Examples

      iex> list_developer_users()
      [%DeveloperUser{}, ...]

  """
  def list_developer_users do
    Repo.all(DeveloperUser)
  end

  @doc """
  Gets a single developer_user.

  Raises `Ecto.NoResultsError` if the Developer user does not exist.

  ## Examples

      iex> get_developer_user!(123)
      %DeveloperUser{}

      iex> get_developer_user!(456)
      ** (Ecto.NoResultsError)

  """
  def get_developer_user!(id), do: Repo.get!(DeveloperUser, id)

  @doc """
  Creates a developer_user.

  ## Examples

      iex> create_developer_user(%{field: value})
      {:ok, %DeveloperUser{}}

      iex> create_developer_user(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_developer_user(attrs \\ %{}) do
    %DeveloperUser{}
    |> DeveloperUser.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a developer_user.

  ## Examples

      iex> update_developer_user(developer_user, %{field: new_value})
      {:ok, %DeveloperUser{}}

      iex> update_developer_user(developer_user, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_developer_user(%DeveloperUser{} = developer_user, attrs) do
    developer_user
    |> DeveloperUser.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a DeveloperUser.

  ## Examples

      iex> delete_developer_user(developer_user)
      {:ok, %DeveloperUser{}}

      iex> delete_developer_user(developer_user)
      {:error, %Ecto.Changeset{}}

  """
  def delete_developer_user(%DeveloperUser{} = developer_user) do
    Repo.delete(developer_user)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking developer_user changes.

  ## Examples

      iex> change_developer_user(developer_user)
      %Ecto.Changeset{source: %DeveloperUser{}}

  """
  def change_developer_user(%DeveloperUser{} = developer_user, attrs \\ %{}) do
    DeveloperUser.changeset(developer_user, attrs)
  end

  ################################################
  # filter configs. Keep these grouped together! #
  ################################################

  defp filter_config(:developer_users) do
    defconfig do
      text(:public_key)
      text(:git_handle)
      text(:slack_handle)
    end
  end

  defp filter_config(:users) do
    defconfig do
      text(:user_name)
      text(:public_key)
    end
  end

  alias Helios.Accounts.{Admin, AdminToken, AdminNotifier}

  ## Database getters

  @doc """
  Gets a admin by email.

  ## Examples

      iex> get_admin_by_email("foo@example.com")
      %Admin{}

      iex> get_admin_by_email("unknown@example.com")
      nil

  """
  def get_admin_by_email(email) when is_binary(email) do
    Repo.get_by(Admin, email: email)
  end

  @doc """
  Gets a admin by email and password.

  ## Examples

      iex> get_admin_by_email_and_password("foo@example.com", "correct_password")
      %Admin{}

      iex> get_admin_by_email_and_password("foo@example.com", "invalid_password")
      nil

  """
  def get_admin_by_email_and_password(email, password)
      when is_binary(email) and is_binary(password) do
    admin = Repo.get_by(Admin, email: email)
    if Admin.valid_password?(admin, password), do: admin
  end

  @doc """
  Gets a single admin.

  Raises `Ecto.NoResultsError` if the Admin does not exist.

  ## Examples

      iex> get_admin!(123)
      %Admin{}

      iex> get_admin!(456)
      ** (Ecto.NoResultsError)

  """
  def get_admin!(id), do: Repo.get!(Admin, id)

  ## Admin registration

  @doc """
  Registers a admin.

  ## Examples

      iex> register_admin(%{field: value})
      {:ok, %Admin{}}

      iex> register_admin(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def register_admin(attrs) do
    %Admin{}
    |> Admin.registration_changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking admin changes.

  ## Examples

      iex> change_admin_registration(admin)
      %Ecto.Changeset{data: %Admin{}}

  """
  def change_admin_registration(%Admin{} = admin, attrs \\ %{}) do
    Admin.registration_changeset(admin, attrs, hash_password: false)
  end

  ## Settings

  @doc """
  Returns an `%Ecto.Changeset{}` for changing the admin email.

  ## Examples

      iex> change_admin_email(admin)
      %Ecto.Changeset{data: %Admin{}}

  """
  def change_admin_email(admin, attrs \\ %{}) do
    Admin.email_changeset(admin, attrs)
  end

  @doc """
  Emulates that the email will change without actually changing
  it in the database.

  ## Examples

      iex> apply_admin_email(admin, "valid password", %{email: ...})
      {:ok, %Admin{}}

      iex> apply_admin_email(admin, "invalid password", %{email: ...})
      {:error, %Ecto.Changeset{}}

  """
  def apply_admin_email(admin, password, attrs) do
    admin
    |> Admin.email_changeset(attrs)
    |> Admin.validate_current_password(password)
    |> Ecto.Changeset.apply_action(:update)
  end

  @doc """
  Updates the admin email using the given token.

  If the token matches, the admin email is updated and the token is deleted.
  The confirmed_at date is also updated to the current time.
  """
  def update_admin_email(admin, token) do
    context = "change:#{admin.email}"

    with {:ok, query} <- AdminToken.verify_change_email_token_query(token, context),
         %AdminToken{sent_to: email} <- Repo.one(query),
         {:ok, _} <- Repo.transaction(admin_email_multi(admin, email, context)) do
      :ok
    else
      _ -> :error
    end
  end

  defp admin_email_multi(admin, email, context) do
    changeset =
      admin
      |> Admin.email_changeset(%{email: email})
      |> Admin.confirm_changeset()

    Ecto.Multi.new()
    |> Ecto.Multi.update(:admin, changeset)
    |> Ecto.Multi.delete_all(:tokens, AdminToken.admin_and_contexts_query(admin, [context]))
  end

  @doc """
  Delivers the update email instructions to the given admin.

  ## Examples

      iex> deliver_update_email_instructions(admin, current_email, &Routes.admin_update_email_url(conn, :edit, &1))
      {:ok, %{to: ..., body: ...}}

  """
  def deliver_update_email_instructions(%Admin{} = admin, current_email, update_email_url_fun)
      when is_function(update_email_url_fun, 1) do
    {encoded_token, admin_token} = AdminToken.build_email_token(admin, "change:#{current_email}")

    Repo.insert!(admin_token)
    AdminNotifier.deliver_update_email_instructions(admin, update_email_url_fun.(encoded_token))
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for changing the admin password.

  ## Examples

      iex> change_admin_password(admin)
      %Ecto.Changeset{data: %Admin{}}

  """
  def change_admin_password(admin, attrs \\ %{}) do
    Admin.password_changeset(admin, attrs, hash_password: false)
  end

  @doc """
  Updates the admin password.

  ## Examples

      iex> update_admin_password(admin, "valid password", %{password: ...})
      {:ok, %Admin{}}

      iex> update_admin_password(admin, "invalid password", %{password: ...})
      {:error, %Ecto.Changeset{}}

  """
  def update_admin_password(admin, password, attrs) do
    changeset =
      admin
      |> Admin.password_changeset(attrs)
      |> Admin.validate_current_password(password)

    Ecto.Multi.new()
    |> Ecto.Multi.update(:admin, changeset)
    |> Ecto.Multi.delete_all(:tokens, AdminToken.admin_and_contexts_query(admin, :all))
    |> Repo.transaction()
    |> case do
      {:ok, %{admin: admin}} -> {:ok, admin}
      {:error, :admin, changeset, _} -> {:error, changeset}
    end
  end

  ## Session

  @doc """
  Generates a session token.
  """
  def generate_admin_session_token(admin) do
    {token, admin_token} = AdminToken.build_session_token(admin)
    Repo.insert!(admin_token)
    token
  end

  @doc """
  Gets the admin with the given signed token.
  """
  def get_admin_by_session_token(token) do
    {:ok, query} = AdminToken.verify_session_token_query(token)
    Repo.one(query)
  end

  @doc """
  Deletes the signed token with the given context.
  """
  def delete_session_token(token) do
    Repo.delete_all(AdminToken.token_and_context_query(token, "session"))
    :ok
  end

  ## Confirmation

  @doc """
  Delivers the confirmation email instructions to the given admin.

  ## Examples

      iex> deliver_admin_confirmation_instructions(admin, &Routes.admin_confirmation_url(conn, :edit, &1))
      {:ok, %{to: ..., body: ...}}

      iex> deliver_admin_confirmation_instructions(confirmed_admin, &Routes.admin_confirmation_url(conn, :edit, &1))
      {:error, :already_confirmed}

  """
  def deliver_admin_confirmation_instructions(%Admin{} = admin, confirmation_url_fun)
      when is_function(confirmation_url_fun, 1) do
    if admin.confirmed_at do
      {:error, :already_confirmed}
    else
      {encoded_token, admin_token} = AdminToken.build_email_token(admin, "confirm")
      Repo.insert!(admin_token)
      AdminNotifier.deliver_confirmation_instructions(admin, confirmation_url_fun.(encoded_token))
    end
  end

  @doc """
  Confirms a admin by the given token.

  If the token matches, the admin account is marked as confirmed
  and the token is deleted.
  """
  def confirm_admin(token) do
    with {:ok, query} <- AdminToken.verify_email_token_query(token, "confirm"),
         %Admin{} = admin <- Repo.one(query),
         {:ok, %{admin: admin}} <- Repo.transaction(confirm_admin_multi(admin)) do
      {:ok, admin}
    else
      _ -> :error
    end
  end

  defp confirm_admin_multi(admin) do
    Ecto.Multi.new()
    |> Ecto.Multi.update(:admin, Admin.confirm_changeset(admin))
    |> Ecto.Multi.delete_all(:tokens, AdminToken.admin_and_contexts_query(admin, ["confirm"]))
  end

  ## Reset password

  @doc """
  Delivers the reset password email to the given admin.

  ## Examples

      iex> deliver_admin_reset_password_instructions(admin, &Routes.admin_reset_password_url(conn, :edit, &1))
      {:ok, %{to: ..., body: ...}}

  """
  def deliver_admin_reset_password_instructions(%Admin{} = admin, reset_password_url_fun)
      when is_function(reset_password_url_fun, 1) do
    {encoded_token, admin_token} = AdminToken.build_email_token(admin, "reset_password")
    Repo.insert!(admin_token)

    AdminNotifier.deliver_reset_password_instructions(
      admin,
      reset_password_url_fun.(encoded_token)
    )
  end

  @doc """
  Gets the admin by reset password token.

  ## Examples

      iex> get_admin_by_reset_password_token("validtoken")
      %Admin{}

      iex> get_admin_by_reset_password_token("invalidtoken")
      nil

  """
  def get_admin_by_reset_password_token(token) do
    with {:ok, query} <- AdminToken.verify_email_token_query(token, "reset_password"),
         %Admin{} = admin <- Repo.one(query) do
      admin
    else
      _ -> nil
    end
  end

  @doc """
  Resets the admin password.

  ## Examples

      iex> reset_admin_password(admin, %{password: "new long password", password_confirmation: "new long password"})
      {:ok, %Admin{}}

      iex> reset_admin_password(admin, %{password: "valid", password_confirmation: "not the same"})
      {:error, %Ecto.Changeset{}}

  """
  def reset_admin_password(admin, attrs) do
    Ecto.Multi.new()
    |> Ecto.Multi.update(:admin, Admin.password_changeset(admin, attrs))
    |> Ecto.Multi.delete_all(:tokens, AdminToken.admin_and_contexts_query(admin, :all))
    |> Repo.transaction()
    |> case do
      {:ok, %{admin: admin}} -> {:ok, admin}
      {:error, :admin, changeset, _} -> {:error, changeset}
    end
  end
end
