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

  def weather_info_data(parent, _args, _info) do
    {:ok, Enum.at(parent["weather"], 0)}
  end
end
