defmodule HeliosWeb.Schema.Resolvers.Weather do
  @test_query [
    %{temp: 56, day: "Friday"},
    %{temp: 34, day: "Saturday"},
    %{temp: 21, day: "Sunday"}
  ]

  def all_weather(_parent, _args, _resolution) do
    {:ok, @test_query}
  end

  def create(_parent, %{weather: weather_params}, _resolution) do
    newData = @test_query ++ [weather_params]
    {:ok, newData}
  end
end
