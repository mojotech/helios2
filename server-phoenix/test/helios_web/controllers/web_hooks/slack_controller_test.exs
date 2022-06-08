defmodule HeliosWeb.WebHooks.SlackControllerTest do
  use HeliosWeb.ConnCase, async: true
  use ExUnit.Case
  alias Helios.Event
  alias Helios.Repo

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

  defp get_slack_messages() do
    Event
    |> Event.slack_messages()
    |> Repo.all()
  end
end
