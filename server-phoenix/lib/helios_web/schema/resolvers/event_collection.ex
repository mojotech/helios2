defmodule HeliosWeb.Schema.Resolvers.EventCollection do
  @test_query_data %{
    all: [
      %{id: 1, source: "github_pull", created_at: ~U[2022-02-16 16:31:17Z]},
      %{id: 2, source: "github_commit", created_at: ~U[2022-02-16 16:33:17Z]},
      %{id: 3, source: "slack_message", created_at: ~U[2022-02-16 16:37:17Z]},
      %{id: 4, source: "github_commit", created_at: ~U[2022-02-17 16:31:17Z]},
      %{id: 5, source: "github_commit", created_at: ~U[2022-02-17 16:33:17Z]},
      %{id: 6, source: "slack_message", created_at: ~U[2022-02-17 16:35:17Z]}
    ],
    count: %{github_pull: 1, github_commit: 1, slack_message: 1}
  }

  defp test_query(args) do
    new_data =
      case args do
        %{type: type} ->
          IO.puts("no created, type")

          @test_query_data.all
          |> Enum.filter(fn event -> event.source == type end)

        %{created_after: created_after} ->
          IO.puts("created, no type")

          @test_query_data.all
          |> Enum.filter(fn event -> DateTime.compare(event.created_at, created_after) == :gt end)

        %{created_after: created_after, type: type} ->
          IO.puts("both")

          @test_query_data.all
          |> Enum.filter(fn event -> DateTime.compare(event.created_at, created_after) == :gt end)
          |> Enum.filter(fn event -> event.source == type end)

        _ ->
          @test_query_data.all
      end

    %{all: new_data, count: @test_query_data.count}
  end

  def events(args, _info) do
    {:ok, test_query(args)}
  end
end
