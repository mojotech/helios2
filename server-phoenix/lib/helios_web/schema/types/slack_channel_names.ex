defmodule HeliosWeb.Schema.Types.SlackChannelNames do
  use Absinthe.Schema.Notation

  object :slack_channel_names do
    field(:channel_name, non_null(:string))
    field(:channel_id, non_null(:string))
  end
end
