defmodule Mix.Tasks.Simulate do
  use Mix.Task
  alias Helios.{Repo, Event}
  require Phoenix.ConnTest

  def run(args) do
    Mix.Task.run("app.start")
    source = Enum.at(args, 0)
    github_external_id = UUID.uuid4(:hex) |> String.slice(0..19)

    slack_external_id =
      "#{to_string(Enum.random(1_000_000_000..9_999_999_999))}.#{to_string(Enum.random(100_000..999_999))}"

    if Enum.member?(["push", "pull_request", "slack_message"], source) do
      event =
        case source do
          "pull_request" ->
            Repo.insert!(%Event{
              source: :github_pull,
              external_id: github_external_id
            })

          "push" ->
            Repo.insert!(%Event{
              source: :github_commit,
              external_id: github_external_id
            })

          "slack_message" ->
            Repo.insert!(%Event{
              source: :slack_message,
              external_id: slack_external_id
            })
        end

      try do
        HTTPoison.post!(
          "#{System.get_env("BACKEND_URL")}/web_hooks/publish",
          event |> Map.from_struct() |> Map.delete(:__meta__) |> Jason.encode!(),
          [{"Content-type", "application/json"}],
          []
        )

        IO.puts("Event was inserted into the database and published to the subscription")
      rescue
        HTTPoison.Error -> IO.puts("Event was inserted into the database")
      end
    else
      raise "Invalid Source Type"
    end
  end
end
