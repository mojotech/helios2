defmodule HeliosWeb.Schema.Types.User do
  use Absinthe.Schema.Notation

  object :user do
    field(:user_name, :string)
    field(:public_key, :string)
  end
end
