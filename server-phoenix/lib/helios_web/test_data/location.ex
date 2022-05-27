defmodule HeliosWeb.TestData.Location do
  def location(city_name) do
    case city_name do
      "Providence" ->
        "{\"id\":1,\"latitude\":41.823989,\"longitude\":-71.412834,\"city_name\":\"Providence\",\"time_zone\":\"America/New_York\",\"inserted_at\":\"2022-02-22T19:48:40.735Z\",\"updated_at\":\"2022-02-22T19:48:40.735Z\",\"wifi_name\":\"mojotech-guest\",\"wifi_password\":\"p@ssw0rd\",\"bathroom_code\":\"0000*\"}"

      "Boulder" ->
        "{\"id\":2,\"latitude\":40.014986,\"longitude\":-105.270546,\"city_name\":\"Boulder\",\"time_zone\":\"America/Denver\",\"inserted_at\":\"2022-02-22T19:48:40.737Z\",\"updated_at\":\"2022-02-22T19:48:40.737Z\",\"wifi_name\":\"mojotech-guest\",\"wifi_password\":\"p@ssw0rd\",\"bathroom_code\":null}"
    end
  end
end
