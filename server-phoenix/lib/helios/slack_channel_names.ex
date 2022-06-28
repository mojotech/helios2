defmodule Helios.SlackChannelNames do
  use Ecto.Schema

  import Ecto.Changeset
  import Ecto.Query

  schema "slack_channel_names" do
    # make these snake case
    field :channel_name, :string
    field :channel_id, :string

    timestamps()
  end

  def with_id(query, channel_id) do
    from(q in query, where: q.channel_id == ^channel_id, select: {q.channel_id})
  end
end
