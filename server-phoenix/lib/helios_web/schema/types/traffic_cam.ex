defmodule HeliosWeb.Schema.Types.TrafficCam do
  use Absinthe.Schema.Notation

  object :traffic_cam do
    field(:id, non_null(:id))
    field(:title, non_null(:string))
    field(:url, non_null(:string))
    field(:feed_format, non_null(:string))
  end
end
