defmodule HeliosWeb.Schema.Types.Event do
  use Absinthe.Schema.Notation

  enum :event_source do
    value(:github_pull, as: "github_pull", name: "github_pull", description: "Github pull request")

    value(:github_commit, as: "github_commit", name: "github_commit", description: "Github commit")

    value(:slack_message, as: "slack_message", name: "slack_message", description: "Slack message")
  end

  object :event do
    field(:id, :id)
    field(:external_id, :string)
    field(:source, :event_source)
    field(:created_at, :datetime)
  end
end
