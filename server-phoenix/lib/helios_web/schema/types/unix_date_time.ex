defmodule HeliosWeb.Schema.Types.UnixDateTime do
  use Absinthe.Schema.Notation

  scalar :unix_date_time, name: "UnixDateTime" do
    serialize(&serialize_time/1)
  end

  defp serialize_time(value) do
    value |> DateTime.from_unix!() |> DateTime.to_iso8601()
  end
end
