defmodule HeliosWeb.Schema.Types.EventCollection do
  use Absinthe.Schema.Notation
  alias HeliosWeb.Schema.Resolvers.EventCollection

  object :event_count do
    field(:github_pull, :integer)
    field(:github_commit, :integer)
    field(:slack_message, :integer)
  end

  object :author_contribution do
    field(:count, :integer)
    field(:source_author, :string)
  end

  object :event_collection do
    field(:all, non_null(list_of(:event))) do
      resolve(&EventCollection.all/3)
    end

    field(:by_author, list_of(:author_contribution)) do
      arg(:top, :integer)
      resolve(&EventCollection.by_author/3)
    end

    field(:count, non_null(:event_count),
      default_value: %{
        github_pull: 0,
        github_commit: 0,
        slack_message: 0
      }
    ) do
      resolve(&EventCollection.count/3)
    end
  end
end
