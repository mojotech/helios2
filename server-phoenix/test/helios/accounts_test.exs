defmodule Helios.AccountsTest do
  use Helios.DataCase

  alias Helios.Accounts

  import Helios.AccountsFixtures
  alias Helios.Accounts.{AdminUser, AdminUserToken}

  describe "get_admin_user_by_email/1" do
    test "does not return the admin_user if the email does not exist" do
      refute Accounts.get_admin_user_by_email("unknown@example.com")
    end

    test "returns the admin_user if the email exists" do
      %{id: id} = admin_user = admin_user_fixture()
      assert %AdminUser{id: ^id} = Accounts.get_admin_user_by_email(admin_user.email)
    end
  end

  describe "get_admin_user_by_email_and_password/2" do
    test "does not return the admin_user if the email does not exist" do
      refute Accounts.get_admin_user_by_email_and_password("unknown@example.com", "hello world!")
    end

    test "does not return the admin_user if the password is not valid" do
      admin_user = admin_user_fixture()
      refute Accounts.get_admin_user_by_email_and_password(admin_user.email, "invalid")
    end

    test "returns the admin_user if the email and password are valid" do
      %{id: id} = admin_user = admin_user_fixture()

      assert %AdminUser{id: ^id} =
               Accounts.get_admin_user_by_email_and_password(
                 admin_user.email,
                 valid_admin_user_password()
               )
    end
  end

  describe "get_admin_user!/1" do
    test "raises if id is invalid" do
      assert_raise Ecto.NoResultsError, fn ->
        Accounts.get_admin_user!(-1)
      end
    end

    test "returns the admin_user with the given id" do
      %{id: id} = admin_user = admin_user_fixture()
      assert %AdminUser{id: ^id} = Accounts.get_admin_user!(admin_user.id)
    end
  end

  describe "update_admin_user_password/3" do
    setup do
      %{admin_user: admin_user_fixture()}
    end

    test "validates password", %{admin_user: admin_user} do
      {:error, changeset} =
        Accounts.update_admin_user_password(admin_user, valid_admin_user_password(), %{
          password: "not valid",
          password_confirmation: "another"
        })

      assert %{
               password: ["should be at least 12 character(s)"],
               password_confirmation: ["does not match password"]
             } = errors_on(changeset)
    end

    test "validates maximum values for password for security", %{admin_user: admin_user} do
      too_long = String.duplicate("db", 100)

      {:error, changeset} =
        Accounts.update_admin_user_password(admin_user, valid_admin_user_password(), %{
          password: too_long
        })

      assert "should be at most 72 character(s)" in errors_on(changeset).password
    end

    test "validates current password", %{admin_user: admin_user} do
      {:error, changeset} =
        Accounts.update_admin_user_password(admin_user, "invalid", %{
          password: valid_admin_user_password()
        })

      assert %{current_password: ["is not valid"]} = errors_on(changeset)
    end

    test "updates the password", %{admin_user: admin_user} do
      {:ok, admin_user} =
        Accounts.update_admin_user_password(admin_user, valid_admin_user_password(), %{
          password: "new valid password"
        })

      assert is_nil(admin_user.password)
      assert Accounts.get_admin_user_by_email_and_password(admin_user.email, "new valid password")
    end

    test "deletes all tokens for the given admin_user", %{admin_user: admin_user} do
      _ = Accounts.generate_admin_user_session_token(admin_user)

      {:ok, _} =
        Accounts.update_admin_user_password(admin_user, valid_admin_user_password(), %{
          password: "new valid password"
        })

      refute Repo.get_by(AdminUserToken, admin_user_id: admin_user.id)
    end
  end

  describe "generate_admin_user_session_token/1" do
    setup do
      %{admin_user: admin_user_fixture()}
    end

    test "generates a token", %{admin_user: admin_user} do
      token = Accounts.generate_admin_user_session_token(admin_user)
      assert admin_user_token = Repo.get_by(AdminUserToken, token: token)
      assert admin_user_token.context == "session"

      # Creating the same token for another admin_user should fail
      assert_raise Ecto.ConstraintError, fn ->
        Repo.insert!(%AdminUserToken{
          token: admin_user_token.token,
          admin_user_id: admin_user_fixture().id,
          context: "session"
        })
      end
    end
  end

  describe "get_admin_user_by_session_token/1" do
    setup do
      admin_user = admin_user_fixture()
      token = Accounts.generate_admin_user_session_token(admin_user)
      %{admin_user: admin_user, token: token}
    end

    test "returns admin_user by token", %{admin_user: admin_user, token: token} do
      assert session_admin_user = Accounts.get_admin_user_by_session_token(token)
      assert session_admin_user.id == admin_user.id
    end

    test "does not return admin_user for invalid token" do
      refute Accounts.get_admin_user_by_session_token("oops")
    end

    test "does not return admin_user for expired token", %{token: token} do
      {1, nil} = Repo.update_all(AdminUserToken, set: [created_at: ~N[2020-01-01 00:00:00]])
      refute Accounts.get_admin_user_by_session_token(token)
    end
  end

  describe "delete_session_token/1" do
    test "deletes the token" do
      admin_user = admin_user_fixture()
      token = Accounts.generate_admin_user_session_token(admin_user)
      assert Accounts.delete_session_token(token) == :ok
      refute Accounts.get_admin_user_by_session_token(token)
    end
  end

  describe "inspect/2" do
    test "does not include password" do
      refute inspect(%AdminUser{password: "123456"}) =~ "password: \"123456\""
    end
  end
end
