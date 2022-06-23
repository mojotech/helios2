defmodule HeliosWeb.Schema.Types.Event do
  use Absinthe.Schema.Notation

  enum :event_source do
    value(:github_pull, name: "githubPull", description: "Github pull request")

    value(:github_commit, name: "githubCommit", description: "Github commit")

    value(:slack_message, name: "slackMessage", description: "Slack message")
  end

  object :event do
    field(:id, non_null(:id))
    field(:external_id, non_null(:string))
    field(:source, non_null(:event_source))
    field(:source_channel, non_null(:string))
    field(:inserted_at, non_null(:datetime))
  end
end
