defmodule HeliosWeb.Schema.Types.Employee do
  use Absinthe.Schema.Notation

  object :employee do
    field(:id, :id)
    field(:display_name, :string)
    field(:is_photo_uploaded, :string)
    field(:photo_url, :string)
  end
end
