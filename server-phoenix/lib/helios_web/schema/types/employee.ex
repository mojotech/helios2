defmodule HeliosWeb.Schema.Types.Employee do
  use Absinthe.Schema.Notation

  object :employee do
    field(:id, non_null(:id))
    field(:display_name, non_null(:string))
    field(:is_photo_uploaded, non_null(:string))
    field(:photo_url, non_null(:string))
  end
end
