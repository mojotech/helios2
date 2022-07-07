defmodule Helios.SlackChannelNames do
  use Ecto.Schema

  import Ecto.Changeset
  import Ecto.Query

  schema "slack_channel_names" do
    field :channel_name, :string
    field :channel_id, :string

    timestamps()
  end

  def with_id(query \\ __MODULE__, channel_id) do
    from(q in query, where: q.channel_id == ^channel_id, select: {q.channel_id})
  end

  def name_from_id(query, channel_id) do
    from(q in query, where: q.channel_id == ^channel_id, select: q.channel_name)
  end
end
