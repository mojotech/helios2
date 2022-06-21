defmodule HeliosWeb.Schema.Types.SlackChannelNames do
  use Absinthe.Schema.Notation

  object :slack_channel_names do
    field(:channelName, non_null(:string))
    field(:channelId, non_null(:string))
  end
end
