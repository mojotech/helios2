defmodule HeliosWeb.WebHooks.EventsAPIControllerTest do
  use HeliosWeb.ConnCase, async: true
  use ExUnit.Case
  alias Helios.Event
  alias Helios.Repo

  test "Proper status codes on different request", %{conn: conn} do
    conn_1 =
      conn
      |> put_req_header("content-type", "application/json")
      |> post(
        Routes.events_api_path(conn, :handle, "1"),
        %{
          event_type: "foo_bar",
          author: "RVRX",
          event_id: "a26asde67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c"
        }
      )

    conn_2 =
      conn
      |> put_req_header("content-type", "application/json")
      |> post(
        Routes.events_api_path(conn, :handle, "2"),
        %{
          event_type: "foo_bar",
          author: "RVRX",
          event_id: "826asde67dff5eaf1h6ba5c57fc3c7d91ac0fd1c"
        }
      )

    conn_3 =
      conn
      |> put_req_header("content-type", "application/json")
      |> post(
        Routes.events_api_path(conn, :handle, "1"),
        %{
          event_type: "github_commit",
          author: "RVRX",
          event_id: "x26asde67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c"
        }
      )

    conn_4 =
      conn
      |> put_req_header("content-type", "application/json")
      |> post(
        Routes.events_api_path(conn, :handle, "1"),
        %{
          event_type: "github_commit",
          author: "RVRX",
          event_id: "x26asde67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c"
        }
      )

    # Bad Request (Malformed)
    assert conn_1.status == 400
    # Not Found (No endpoint at URL)
    assert conn_2.status == 404
    # Created
    assert conn_3.status == 201
    # Already Reported (Duplicate event)
    assert conn_4.status == 208
  end

  test "POST new commit", %{conn: conn} do
    conn =
      conn
      |> put_req_header("content-type", "application/json")
      |> post(
        Routes.events_api_path(conn, :handle, "1"),
        %{
          event_type: "github_commit",
          author: "RVRX",
          event_id: "a26asde67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c"
        }
      )

    assert conn.status == 201
    assert length(get_commits()) == 1
  end

  test "POST new PR", %{conn: conn} do
    conn =
      conn
      |> put_req_header("content-type", "application/json")
      |> post(
        Routes.events_api_path(conn, :handle, "1"),
        %{
          event_type: "github_pr",
          author: "RVRX",
          event_id: "726abde67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c"
        }
      )

    assert conn.status == 201
    assert length(get_commits()) == 0
    assert length(get_prs()) == 1
  end

  test "POST multiple commits (w/ duplicate IDs) and PRs", %{conn: conn} do
    conn = conn |> put_req_header("content-type", "application/json")

    conn
    |> post(
      Routes.events_api_path(conn, :handle, "1"),
      %{
        event_type: "github_commit",
        author: "some1",
        event_id: "a-common-hash"
      }
    )

    conn
    |> post(
      Routes.events_api_path(conn, :handle, "1"),
      %{
        event_type: "github_commit",
        author: "some1 else w/ same id",
        event_id: "a-common-hash"
      }
    )

    conn
    |> post(
      Routes.events_api_path(conn, :handle, "1"),
      %{
        event_type: "github_pr",
        author: "RVRX",
        event_id: "unique-hash"
      }
    )

    conn
    |> post(
      Routes.events_api_path(conn, :handle, "1"),
      %{
        event_type: "github_pr",
        author: "RVRX",
        event_id: "another-unique-hash"
      }
    )

    assert length(get_commits()) == 1
    assert length(get_prs()) == 2
  end

  defp get_commits() do
    Event
    |> Event.commits()
    |> Repo.all()
  end

  defp get_prs() do
    Event
    |> Event.pull_requests()
    |> Repo.all()
  end
end
