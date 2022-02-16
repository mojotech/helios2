defmodule HeliosWeb.Schema.Types.EventCollection do
  use Absinthe.Schema.Notation

  object :event_count do
    field(:github_pull, non_null(:integer))
    field(:github_commit, non_null(:integer))
    field(:slack_message, non_null(:integer))
  end

  object :event_collection do
    field(:all, non_null(list_of(:event)))

    field(:count, non_null(:event_count),
      default_value: %{
        github_pull: 0,
        github_commit: 0,
        slack_message: 0
      }
    )
  end
end
