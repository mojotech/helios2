defmodule HeliosWeb.SchemaTest do
  use ExUnit.Case

  alias HeliosWeb.Schema

  defp atomSource, do: %{source: %{a: "1"}, state: :unknown, value: nil}
  defp atomKey, do: :a
  defp stringSource, do: %{source: %{"a" => "1"}, state: :unknown, value: nil}
  defp stringKey, do: "a"

  test "atom in source, atom key" do
    assert Schema.get_atoms_or_string_key(atomSource(), atomKey()) === %{
             atomSource()
             | state: :resolved,
               value: "1"
           }
  end

  test "atom in source, string key" do
    assert_raise ArgumentError, "#{stringKey()} is missing in source", fn ->
      Schema.get_atoms_or_string_key(atomSource(), stringKey())
    end
  end

  test "string in source, atom key" do
    assert Schema.get_atoms_or_string_key(stringSource(), atomKey()) === %{
             stringSource()
             | state: :resolved,
               value: "1"
           }
  end

  test "string in source, string key" do
    assert Schema.get_atoms_or_string_key(stringSource(), stringKey()) === %{
             stringSource()
             | state: :resolved,
               value: "1"
           }
  end
end
