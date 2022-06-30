defmodule Helios.TorchContextFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `Helios.TorchContext` context.
  """

  @doc """
  Generate a user.
  """
  def user_fixture(attrs \\ %{}) do
    {:ok, user} =
      attrs
      |> Enum.into(%{
        id: 42,
        inserted_at: ~N[2022-06-29 18:19:00],
        public_key: "some public_key",
        updated_at: ~N[2022-06-29 18:19:00],
        user_name: "some user_name"
      })
      |> Helios.TorchContext.create_user()

    user
  end

  @doc """
  Generate a user.
  """
  def user_fixture(attrs \\ %{}) do
    {:ok, user} =
      attrs
      |> Enum.into(%{
        id: 42,
        inserted_at: ~N[2022-06-29 18:43:00],
        public_key: "some public_key",
        updated_at: ~N[2022-06-29 18:43:00],
        user_name: "some user_name"
      })
      |> Helios.TorchContext.create_user()

    user
  end
end
