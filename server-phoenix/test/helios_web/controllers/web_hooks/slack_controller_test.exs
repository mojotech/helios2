defmodule HeliosWeb.WebHooks.SlackControllerTest do
  use HeliosWeb.ConnCase, async: true
  use ExUnit.Case
  import Mock
  alias Helios.Events.Event
  alias Helios.Repo
  alias Helios.SlackChannelNames
  alias Helios.Feed
  require Logger

  test "connection response OK", %{conn: conn} do
    conn =
      conn
      |> put_req_header("content-type", "application/json")
      |> post(
        Routes.slack_path(conn, :handle),
        %{
          token: "Sim-123456",
          team_id: "TXXXXXXXX",
          api_app_id: "AXXXXXXXX",
          event: %{
            client_msg_id: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
            type: "message",
            text: "hi",
            user: "Priscila",
            ts: "155984192.001600",
            channel: "CXXXXXXXX",
            event_ts: "1559841925.001600",
            channel_type: "channel"
          },
          type: "event_callback",
          event_id: "<%= @event_id %>",
          event_time: 1_559_841_923,
          authed_users: ["UXXXXXXXX", "UXXXXXXXX"],
          slack: %{
            token: "Sim-123456",
            team_id: "TXXXXXXXX",
            api_app_id: "AXXXXXX",
            event: %{
              client_msg_id: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
              type: "message",
              text: "hi",
              user: "UXXXXXXXX",
              ts: "1559841924.001600",
              channel: "CXXXXXXXX",
              event_ts: "1559841924.001600",
              channel_type: "channel"
            },
            type: "event_callback",
            event_id: "EvXXXXXX",
            event_time: 1_559_841_923,
            authed_users: ["UXXXXXXXX", "UXXXXXXXX"]
          }
        }
      )

    # Assert proper 'OK' return to connection
    assert conn.status == 200
  end

  test "author was populated in the db", %{conn: conn} do
    conn
    |> put_req_header("content-type", "application/json")
    |> post(
      Routes.slack_path(conn, :handle),
      %{
        token: "Sim-123456",
        team_id: "TXXXXXXXX",
        api_app_id: "AXXXXXXXX",
        event: %{
          client_msg_id: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
          type: "message",
          text: "hi",
          user: "Priscila",
          ts: "155984192.001600",
          channel: "CXXXXXXXX",
          event_ts: "1559841925.001600",
          channel_type: "channel"
        },
        type: "event_callback",
        event_id: "<%= @event_id %>",
        event_time: 1_559_841_923,
        authed_users: ["UXXXXXXXX", "UXXXXXXXX"],
        slack: %{
          token: "Sim-123456",
          team_id: "TXXXXXXXX",
          api_app_id: "AXXXXXX",
          event: %{
            client_msg_id: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
            type: "message",
            text: "hi",
            user: "UXXXXXXXX",
            ts: "1559841924.001600",
            channel: "CXXXXXXXX",
            event_ts: "1559841924.001600",
            channel_type: "channel"
          },
          type: "event_callback",
          event_id: "EvXXXXXX",
          event_time: 1_559_841_923,
          authed_users: ["UXXXXXXXX", "UXXXXXXXX"]
        }
      }
    )

    messages = get_slack_messages()
    assert length(messages) == 1
    first_message = messages |> Enum.at(0)
    assert Map.fetch(first_message, :source_author) == {:ok, "Priscila"}
  end

  test "check channel name (not nil) was added to events table", %{conn: conn} do
    with_mock HTTPoison,
      post!: fn "https://slack.com/api/conversations.info",
                _request_body,
                _headers,
                follow_redirect: true ->
        %HTTPoison.Response{
          body: "{
            \"ok\": \"true\",
            \"channel\": {
                \"name\": \"general\"
            }
        }"
        }
      end do
      conn
      |> put_req_header("content-type", "application/json")
      |> post(
        Routes.slack_path(conn, :handle),
        %{
          event: %{
            channel: "asdf",
            event_ts: "1559841925.001600"
          }
        }
      )

      events =
        Event
        |> Repo.all()

      assert length(events) == 1
      first_event = events |> Enum.at(0)
      assert Map.fetch(first_event, :source_channel) == {:ok, "general"}
    end
  end

  test "check channel name (nil) was added to events table", %{conn: conn} do
    with_mock HTTPoison,
      post!: fn "https://slack.com/api/conversations.info",
                _request_body,
                _headers,
                follow_redirect: true ->
        %HTTPoison.Response{
          body: "{
            \"ok\": \"true\",
            \"channel\": {

            }
        }"
        }
      end do
      conn
      |> put_req_header("content-type", "application/json")
      |> post(
        Routes.slack_path(conn, :handle),
        %{
          event: %{
            channel: "check_nil",
            event_ts: "1559841925.001600"
          }
        }
      )

      events =
        Event
        |> Repo.all()

      assert length(events) == 1
      first_event = events |> Enum.at(0)
      assert Map.fetch(first_event, :source_channel) == {:ok, nil}
    end
  end

  test "channel name (not nil) was added to db with id", %{conn: conn} do
    with_mock HTTPoison,
      post!: fn "https://slack.com/api/conversations.info",
                _request_body,
                _headers,
                follow_redirect: true ->
        %HTTPoison.Response{
          body: "{
            \"ok\": \"true\",
            \"channel\": {
                \"name\": \"general\"
            }
        }"
        }
      end do
      conn
      |> put_req_header("content-type", "application/json")
      |> post(
        Routes.slack_path(conn, :handle),
        %{
          event: %{
            channel: "asdf",
            event_ts: "1559841925.001600"
          }
        }
      )

      channels =
        SlackChannelNames
        |> Repo.all()

      assert length(channels) == 1
      first_channel = channels |> Enum.at(0)
      assert Map.fetch(first_channel, :channel_id) == {:ok, "asdf"}
      assert Map.fetch(first_channel, :channel_name) == {:ok, "general"}
    end
  end

  test "channel name (nil) was added to db with id", %{conn: conn} do
    with_mock HTTPoison,
      post!: fn "https://slack.com/api/conversations.info",
                _request_body,
                _headers,
                follow_redirect: true ->
        %HTTPoison.Response{
          body: "{
            \"ok\": \"true\",
            \"channel\": {

            }
        }"
        }
      end do
      conn
      |> put_req_header("content-type", "application/json")
      |> post(
        Routes.slack_path(conn, :handle),
        %{
          event: %{
            ts: "155984192.001600",
            channel: "check_nil",
            event_ts: "1559841925.001600"
          }
        }
      )

      channels =
        SlackChannelNames
        |> Repo.all()

      assert length(channels) == 1
      first_channel = channels |> Enum.at(0)
      assert Map.fetch(first_channel, :channel_id) == {:ok, "check_nil"}
      assert Map.fetch(first_channel, :channel_name) == {:ok, nil}
    end
  end

  test "interactive message download image", %{conn: conn} do
    params = %{"payload" => "{\"type\":\"interactive_message\",
    \"actions\":
      [{\"name\":\"submit_photo\",\"value\":\"C03KL9YHHGF\"}],
    \"user\":{\"id\":\"U03GCCMJHFY\",\"name\":\"billy\"},
    \"original_message\":
      {
        \"attachments\":
          [
            {
              \"image_url\":\"https:\\/\\/files.slack.com\\/files-pri\\/T025HSHHX-F03PV6HRG2K\\/download\\/test.jpg\"
            }
          ]
      },
    }"}
    {success, result} = JSON.decode(params["payload"])
    image_url = Enum.at(result["original_message"]["attachments"], 0)["image_url"]

    with_mocks([
      {HTTPoison, [],
       post!: fn image_url, _request_body, _headers, follow_redirect: true ->
         %HTTPoison.Response{
           body: "{
                        }"
         }
       end},
      {Helios.Avatar, [], [store: fn _other -> "" end]}
    ]) do
      conn
      |> put_req_header("content-type", "application/json")
      |> post(
        Routes.slack_path(conn, :handle),
        params
      )

      feed =
        Feed
        |> Repo.all()

      assert called(HTTPoison.post!(image_url, :_, :_, follow_redirect: true))
      assert called(Helios.Avatar.store(:_))
      assert length(feed) == 1
      first_feed = feed |> Enum.at(0)
      assert Map.fetch(first_feed, :source) == {:ok, "C03KL9YHHGF"}
      assert Map.fetch(first_feed, :author) == {:ok, "U03GCCMJHFY"}
    end
  end

  test "interactive message do not download image", %{conn: conn} do
    params = %{"payload" => "{\"type\":\"interactive_message\",
    \"actions\":
      [{\"name\":\"submit_photo\",\"value\":\"No\"}],
    \"user\":{\"id\":\"U03GCCMJHFY\",\"name\":\"billy\"},
    \"original_message\":
      {
        \"attachments\":
          [
            {
              \"image_url\":\"https:\\/\\/files.slack.com\\/files-pri\\/T025HSHHX-F03PV6HRG2K\\/download\\/test.jpg\"
            }
          ]
      },
    }"}
    {success, result} = JSON.decode(params["payload"])
    image_url = Enum.at(result["original_message"]["attachments"], 0)["image_url"]

    with_mocks([
      {HTTPoison, [],
       post!: fn image_url, _request_body, _headers, follow_redirect: true ->
         %HTTPoison.Response{
           body: "{
                        }"
         }
       end},
      {Helios.Avatar, [], [store: fn _other -> "" end]}
    ]) do
      conn
      |> put_req_header("content-type", "application/json")
      |> post(
        Routes.slack_path(conn, :handle),
        params
      )

      feed =
        Feed
        |> Repo.all()

      assert_not_called(HTTPoison.post!(image_url, :_, :_, follow_redirect: true))
      assert_not_called(Helios.Avatar.store(:_))
      assert length(feed) == 0
    end
  end

  defp get_slack_messages() do
    Event
    |> Event.slack_messages()
    |> Repo.all()
  end
end
