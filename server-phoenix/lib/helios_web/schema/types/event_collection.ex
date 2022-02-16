defmodule HeliosWeb.Schema.Types.EventCollection do
  use Absinthe.Schema.Notation

  object :event_count do
    field(:github_pull, :integer)
    field(:github_commit, :integer)
    field(:slack_message, :integer)
  end

  object :event_collection do
    field(:all, list_of(:event))

    field(:count, :event_count,
      default_value: %{
        github_pull: 0,
        github_commit: 0,
        slack_message: 0
      }
    )
  end
end
