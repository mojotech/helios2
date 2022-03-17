defmodule HeliosWeb.Schema.Resolvers.Tweet do
  @test_query [
    %{
      "text" =>
        "We had a great time partying with the full MojoTech team recently. Check out some pics from the event!"
    }
  ]

  def tweets(_parent, _args, _info) do
    {:ok, @test_query}
  end
end
