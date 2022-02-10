defmodule HeliosWeb.Schema.Types.Weather do
  use Absinthe.Schema.Notation

  object :weather do
    field(:temp, :integer)
    field(:day, :string)
  end

  input_object :input_weather_params do
    field(:temp, :integer)
    field(:day, :string)
  end
end
