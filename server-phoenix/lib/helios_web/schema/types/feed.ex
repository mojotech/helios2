defmodule HeliosWeb.Schema.Types.Feed do
  use Absinthe.Schema.Notation

  #enum :event_source do
  #  value(:github_pull, name: "githubPull", description: "Github pull request")

   # value(:github_commit, name: "githubCommit", description: "Github commit")

   # value(:slack_message, name: "slackMessage", description: "Slack message")
  #end

  object :feed do
    field(:file_url, non_null(:string))
    field(:author, non_null(:string))
    field(:source, non_null(:string))
    field(:inserted_at, non_null(:datetime))
    field(:updated_at, non_null(:datetime))
  end
end
