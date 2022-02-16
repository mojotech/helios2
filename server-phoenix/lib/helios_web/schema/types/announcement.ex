defmodule HeliosWeb.Schema.Types.Announcement do
  use Absinthe.Schema.Notation

  object :announcement do
    field(:id, non_null(:id))
    field(:publish_on, non_null(:datetime))
    field(:message, non_null(:string))
    field(:people, non_null(:string))
    field(:company, non_null(:string))
    field(:announcement_id, non_null(:string))
    field(:location_id, non_null(:string))
  end
end
