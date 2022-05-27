defmodule HeliosWeb.WebHooks.SlackControllerTest do
  use ExUnit.Case
  alias HeliosWeb.WebHooks.SlackController

  test "Remove 'rd' ordinal suffix from day" do
    assert SlackController.remove_ordinal_suffix_publish_on("May 23rd 2019 at 11:00 am") ===
             "May 23 2019 at 11:00 am"
  end

  test "Remove 'th' ordinal suffix from day" do
    assert SlackController.remove_ordinal_suffix_publish_on("August 5th 2019 at 09:00 am") ===
             "August 5 2019 at 09:00 am"
  end
end
