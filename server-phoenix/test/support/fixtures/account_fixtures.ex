defmodule Helios.AccountFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Helios.Accounts` context.
  """

  @doc """
  Generate a user.
  """
  def user_fixture(attrs \\ %{}) do
    {:ok, user} =
      attrs
      |> Enum.into(%{
        public_key: "some public_key",
        user_name: "some user_name"
      })
      |> Helios.Accounts.create_user()

    user
  end

  @doc """
  Generate a developer_user.
  """
  def developer_user_fixture(attrs \\ %{}) do
    {:ok, developer_user} =
      attrs
      |> Enum.into(%{
        git_handle: "some git_handle",
        public_key: "some public_key",
        slack_handle: "some slack_handle"
      })
      |> Helios.Accounts.create_developer_user()

    developer_user
  end
end
