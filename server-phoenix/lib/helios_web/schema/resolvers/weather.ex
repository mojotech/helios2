defmodule HeliosWeb.Schema.Resolvers.Weather do
  def time(parent, _args, _info) do
    {:ok, parent["dt"]}
  end

  def time_zone(parent, _args, _info) do
    {:ok, parent["timezone"]}
  end

  def precip_probability(parent, _args, _info) do
    {:ok, parent["pop"]}
  end
end
