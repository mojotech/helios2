defmodule HeliosWeb.Schema.Types.Solarcycle do
  use Absinthe.Schema.Notation

  object :solarcycle do
    field(:type, non_null(:string))
    field(:time, non_null(:string))
  end
end
