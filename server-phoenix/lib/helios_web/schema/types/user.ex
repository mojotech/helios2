defmodule HeliosWeb.Schema.Types.User do
  use Absinthe.Schema.Notation

  object :user do
    field(:user_name, non_null(:string))
    field(:public_key, non_null(:string))
  end
end
