defmodule HeliosWeb.Schema.Types.Solarcycle do
  use Absinthe.Schema.Notation

  object :solarcycle do
    field(:type, :string)
    field(:time, :string)
  end
end
