defmodule HeliosWeb.Schema.Types.TrafficCam do
  use Absinthe.Schema.Notation

  object :traffic_cam do
    field(:id, :id)
    field(:title, :string)
    field(:url, :string)
    field(:feedFormat, :string)
  end
end
