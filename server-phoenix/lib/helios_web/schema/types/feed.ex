defmodule HeliosWeb.Schema.Types.Feed do
  use Absinthe.Schema.Notation

  object :feed do
    field(:source, non_null(:string))
    field(:author, non_null(:string))
    field(:uuid, non_null(:string))
  end
end
