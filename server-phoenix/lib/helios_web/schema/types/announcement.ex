defmodule HeliosWeb.Schema.Types.Announcement do
  use Absinthe.Schema.Notation

  object :announcement do
    field(:id, :id)
    field(:publish_on, :datetime)
    field(:message, :string)
    field(:people, :string)
    field(:company, :string)
    field(:announcement_id, :string)
    field(:location_id, :string)
  end
end
