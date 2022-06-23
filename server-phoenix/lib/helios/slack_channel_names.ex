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

  def name_to_id(query, channel_id) do
    from(q in query, where: q.channel_id == ^channel_id, select: q.channel_name)
  end

  # if no slack id and if slack id exists
  # def slack_channels(query) do
  #  from(q in query, where: q.source == :slack_message)
  # end
end
