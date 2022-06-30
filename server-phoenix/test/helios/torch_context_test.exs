defmodule Helios.TorchContextTest do
  use Helios.DataCase

  alias Helios.TorchContext

  alias Helios.TorchContext.User

  @valid_attrs %{id: 42, inserted_at: ~N[2022-06-29 18:19:00], public_key: "some public_key", updated_at: ~N[2022-06-29 18:19:00], user_name: "some user_name"}
  @update_attrs %{id: 43, inserted_at: ~N[2022-06-30 18:19:00], public_key: "some updated public_key", updated_at: ~N[2022-06-30 18:19:00], user_name: "some updated user_name"}
  @invalid_attrs %{id: nil, inserted_at: nil, public_key: nil, updated_at: nil, user_name: nil}

  describe "#paginate_users/1" do
    test "returns paginated list of users" do
      for _ <- 1..20 do
        user_fixture()
      end

      {:ok, %{users: users} = page} = TorchContext.paginate_users(%{})

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
      assert TorchContext.list_users() == [user]
    end
  end

  describe "#get_user!/1" do
    test "returns the user with given id" do
      user = user_fixture()
      assert TorchContext.get_user!(user.id) == user
    end
  end

  describe "#create_user/1" do
    test "with valid data creates a user" do
      assert {:ok, %User{} = user} = TorchContext.create_user(@valid_attrs)
      assert user.id == 42
      assert user.inserted_at == ~N[2022-06-29 18:19:00]
      assert user.public_key == "some public_key"
      assert user.updated_at == ~N[2022-06-29 18:19:00]
      assert user.user_name == "some user_name"
    end

    test "with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = TorchContext.create_user(@invalid_attrs)
    end
  end

  describe "#update_user/2" do
    test "with valid data updates the user" do
      user = user_fixture()
      assert {:ok, user} = TorchContext.update_user(user, @update_attrs)
      assert %User{} = user
      assert user.id == 43
      assert user.inserted_at == ~N[2022-06-30 18:19:00]
      assert user.public_key == "some updated public_key"
      assert user.updated_at == ~N[2022-06-30 18:19:00]
      assert user.user_name == "some updated user_name"
    end

    test "with invalid data returns error changeset" do
      user = user_fixture()
      assert {:error, %Ecto.Changeset{}} = TorchContext.update_user(user, @invalid_attrs)
      assert user == TorchContext.get_user!(user.id)
    end
  end

  describe "#delete_user/1" do
    test "deletes the user" do
      user = user_fixture()
      assert {:ok, %User{}} = TorchContext.delete_user(user)
      assert_raise Ecto.NoResultsError, fn -> TorchContext.get_user!(user.id) end
    end
  end

  describe "#change_user/1" do
    test "returns a user changeset" do
      user = user_fixture()
      assert %Ecto.Changeset{} = TorchContext.change_user(user)
    end
  end

  def user_fixture(attrs \\ %{}) do
    {:ok, user} =
      attrs
      |> Enum.into(@valid_attrs)
      |> TorchContext.create_user()

    user
  end

end
