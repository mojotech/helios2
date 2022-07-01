defmodule Helios.AccountTest do
  use Helios.DataCase

  alias Helios.Accounts
  alias Helios.Accounts.User

  @valid_attrs %{public_key: "some public_key", user_name: "some user_name"}
  @update_attrs %{public_key: "some updated public_key", user_name: "some updated user_name"}
  @invalid_attrs %{public_key: nil, user_name: nil}

  describe "#paginate_users/1" do
    test "returns paginated list of users" do
      for _ <- 1..20 do
        user_fixture()
      end

      {:ok, %{users: users} = page} = Accounts.paginate_users(%{})

      assert length(users) == 15
      assert page.page_number == 1
      assert page.page_size == 15
      assert page.total_pages == 2
      assert page.total_entries == 20
      assert page.distance == 5
      assert page.sort_field == "inserted_at"
      assert page.sort_direction == "desc"
    end
  end

  describe "#list_users/0" do
    test "returns all users" do
      user = user_fixture()
      assert Accounts.list_users() == [user]
    end
  end

  describe "#get_user!/1" do
    test "returns the user with given id" do
      user = user_fixture()
      assert Accounts.get_user!(user.id) == user
    end
  end

  describe "#create_user/1" do
    test "with valid data creates a user" do
      assert {:ok, %User{} = user} = Accounts.create_user(@valid_attrs)
      assert user.public_key == "some public_key"
      assert user.user_name == "some user_name"
    end

    test "with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Accounts.create_user(@invalid_attrs)
    end
  end

  describe "#update_user/2" do
    test "with valid data updates the user" do
      user = user_fixture()
      assert {:ok, user} = Accounts.update_user(user, @update_attrs)
      assert %User{} = user
      assert user.public_key == "some updated public_key"
      assert user.user_name == "some updated user_name"
    end

    test "with invalid data returns error changeset" do
      user = user_fixture()
      assert {:error, %Ecto.Changeset{}} = Accounts.update_user(user, @invalid_attrs)
      assert user == Accounts.get_user!(user.id)
    end
  end

  describe "#delete_user/1" do
    test "deletes the user" do
      user = user_fixture()
      assert {:ok, %User{}} = Accounts.delete_user(user)
      assert_raise Ecto.NoResultsError, fn -> Accounts.get_user!(user.id) end
    end
  end

  describe "#change_user/1" do
    test "returns a user changeset" do
      user = user_fixture()
      assert %Ecto.Changeset{} = Accounts.change_user(user)
    end
  end

  def user_fixture(attrs \\ %{}) do
    {:ok, user} =
      attrs
      |> Enum.into(@valid_attrs)
      |> Accounts.create_user()

    user
  end

  alias Helios.Accounts.DeveloperUser

  @valid_attrs %{
    git_handle: "some git_handle",
    public_key: "some public_key",
    slack_handle: "some slack_handle"
  }
  @update_attrs %{
    git_handle: "some updated git_handle",
    public_key: "some updated public_key",
    slack_handle: "some updated slack_handle"
  }
  @invalid_attrs %{git_handle: nil, public_key: nil, slack_handle: nil}

  describe "#paginate_developer_users/1" do
    test "returns paginated list of developer_users" do
      for _ <- 1..20 do
        developer_user_fixture()
      end

      {:ok, %{developer_users: developer_users} = page} = Accounts.paginate_developer_users(%{})

      assert length(developer_users) == 15
      assert page.page_number == 1
      assert page.page_size == 15
      assert page.total_pages == 2
      assert page.total_entries == 20
      assert page.distance == 5
      assert page.sort_field == "inserted_at"
      assert page.sort_direction == "desc"
    end
  end

  describe "#list_developer_users/0" do
    test "returns all developer_users" do
      developer_user = developer_user_fixture()
      assert Accounts.list_developer_users() == [developer_user]
    end
  end

  describe "#get_developer_user!/1" do
    test "returns the developer_user with given id" do
      developer_user = developer_user_fixture()
      assert Accounts.get_developer_user!(developer_user.id) == developer_user
    end
  end

  describe "#create_developer_user/1" do
    test "with valid data creates a developer_user" do
      assert {:ok, %DeveloperUser{} = developer_user} =
               Accounts.create_developer_user(@valid_attrs)

      assert developer_user.git_handle == "some git_handle"
      assert developer_user.public_key == "some public_key"
      assert developer_user.slack_handle == "some slack_handle"
    end

    test "with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Accounts.create_developer_user(@invalid_attrs)
    end
  end

  describe "#update_developer_user/2" do
    test "with valid data updates the developer_user" do
      developer_user = developer_user_fixture()
      assert {:ok, developer_user} = Accounts.update_developer_user(developer_user, @update_attrs)
      assert %DeveloperUser{} = developer_user
      assert developer_user.git_handle == "some updated git_handle"
      assert developer_user.public_key == "some updated public_key"
      assert developer_user.slack_handle == "some updated slack_handle"
    end

    test "with invalid data returns error changeset" do
      developer_user = developer_user_fixture()

      assert {:error, %Ecto.Changeset{}} =
               Accounts.update_developer_user(developer_user, @invalid_attrs)

      assert developer_user == Accounts.get_developer_user!(developer_user.id)
    end
  end

  describe "#delete_developer_user/1" do
    test "deletes the developer_user" do
      developer_user = developer_user_fixture()
      assert {:ok, %DeveloperUser{}} = Accounts.delete_developer_user(developer_user)
      assert_raise Ecto.NoResultsError, fn -> Accounts.get_developer_user!(developer_user.id) end
    end
  end

  describe "#change_developer_user/1" do
    test "returns a developer_user changeset" do
      developer_user = developer_user_fixture()
      assert %Ecto.Changeset{} = Accounts.change_developer_user(developer_user)
    end
  end

  def developer_user_fixture(attrs \\ %{}) do
    {:ok, developer_user} =
      attrs
      |> Enum.into(@valid_attrs)
      |> Accounts.create_developer_user()

    developer_user
  end
end
