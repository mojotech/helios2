defmodule HeliosWeb.WebHooks.GithubControllerTest do
  use HeliosWeb.ConnCase, async: true
  use ExUnit.Case
  alias Helios.Events.Event
  alias Helios.Repo

  test "connection response OK", %{conn: conn} do
    conn =
      conn
      |> put_req_header("content-type", "application/json")
      |> put_req_header("x-github-event", "push")
      |> post(
        Routes.github_path(conn, :handle),
        %{
          ref: "refs/heads/master",
          commits: [%{id: "a26asde67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c"}],
          repository: %{default_branch: "master"}
        }
      )

    # Assert proper 'OK' return to connection
    assert conn.status == 200
  end

  test "push: single commit to master", %{conn: conn} do
    conn
    |> put_req_header("content-type", "application/json")
    |> put_req_header("x-github-event", "push")
    |> post(
      Routes.github_path(conn, :handle),
      %{
        ref: "refs/heads/master",
        commits: [%{id: "a26asde67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c"}],
        repository: %{default_branch: "master"}
      }
    )

    commits = get_commits()
    assert length(commits) == 1
  end

  test "push: single commit to main", %{conn: conn} do
    conn
    |> put_req_header("content-type", "application/json")
    |> put_req_header("x-github-event", "push")
    |> post(
      Routes.github_path(conn, :handle),
      %{
        ref: "refs/heads/main",
        commits: [%{id: "a26asde67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c"}],
        repository: %{default_branch: "main"}
      }
    )

    commits = get_commits()
    assert length(commits) == 1
  end

  test "push: multiple commits (3 to master at once, 2 to main in new POST w/ duplicate)", %{
    conn: conn
  } do
    conn =
      conn
      |> put_req_header("content-type", "application/json")
      |> put_req_header("x-github-event", "push")

    conn
    |> post(
      Routes.github_path(conn, :handle),
      %{
        ref: "refs/heads/master",
        commits: [
          %{id: "a26asde67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c"},
          %{id: "971786b9d0982a8a26e3d0c3ed6bea008dada524"},
          %{id: "28a63f437c4fef24167b68351fb9a5f8f05758ec"}
        ],
        repository: %{default_branch: "master"}
      }
    )

    conn
    |> post(
      Routes.github_path(conn, :handle),
      %{
        ref: "refs/heads/main",
        commits: [
          %{id: "3708042a6076f227b0323676fc8df43fcb3486e8"},
          %{id: "971786b9d0982a8a26e3d0c3ed6bea008dada524"}
        ],
        repository: %{default_branch: "main"}
      }
    )

    commits = get_commits()
    assert length(commits) == 4
  end

  test "pr: same pr opened and closed + different pr opened", %{conn: conn} do
    conn =
      conn
      |> put_req_header("content-type", "application/json")
      |> put_req_header("x-github-event", "pull_request")

    conn
    |> post(
      Routes.github_path(conn, :handle),
      %{
        action: "opened",
        pull_request: %{
          url: "https://api.github.com/repos/Codertocat/Hello-World/pulls/2",
          id: "279147437"
        }
      }
    )

    conn
    |> post(
      Routes.github_path(conn, :handle),
      %{
        action: "closed",
        pull_request: %{
          url: "https://api.github.com/repos/Codertocat/Hello-World/pulls/2",
          id: "279147437"
        }
      }
    )

    conn
    |> post(
      Routes.github_path(conn, :handle),
      %{
        action: "opened",
        pull_request: %{
          url: "https://api.github.com/repos/Codertocat/Hello-World/pulls/3",
          id: "536663417"
        }
      }
    )

    prs = get_prs()
    assert length(prs) == 2
  end

  test "push: complex/nonstandard default branch name", %{conn: conn} do
    conn
    |> put_req_header("content-type", "application/json")
    |> put_req_header("x-github-event", "push")
    |> post(
      Routes.github_path(conn, :handle),
      %{
        ref: "refs/heads/an/inconvenient/branch//name",
        commits: [%{id: "a26asde67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c"}],
        repository: %{default_branch: "an/inconvenient/branch//name"}
      }
    )

    commits = get_commits()
    assert length(commits) == 1
  end

  test "push: proper author field", %{conn: conn} do
    conn
    |> put_req_header("content-type", "application/json")
    |> put_req_header("x-github-event", "push")
    |> post(
      Routes.github_path(conn, :handle),
      %{
        ref: "refs/heads/master",
        commits: [
          %{
            id: "a26asde67d8f5eaf1f6ba5c57fc3c7d91ac0fd1c",
            author: %{name: "Cole Manning"}
          }
        ],
        repository: %{default_branch: "master"}
      }
    )

    assert get_author(get_commits(), 0) == {:ok, "Cole Manning"}
  end

  test "pr: proper author field", %{conn: conn} do
    conn
    |> put_req_header("content-type", "application/json")
    |> put_req_header("x-github-event", "pull_request")
    |> post(
      Routes.github_path(conn, :handle),
      %{
        action: "opened",
        pull_request: %{
          url: "https://api.github.com/repos/Codertocat/Hello-World/pulls/2",
          id: "279147437",
          user: %{login: "RVRX"}
        }
      }
    )

    assert get_author(get_prs(), 0) == {:ok, "RVRX"}
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

  defp get_author(events, index) do
    events |> Enum.at(index) |> Map.fetch(:source_author)
  end
end
