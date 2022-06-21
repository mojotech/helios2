defmodule HeliosWeb.WebHooks.EventsAPIControllerTest do
  use HeliosWeb.ConnCase, async: true
  use ExUnit.Case
  alias Helios.Event
  alias Helios.Repo
  alias Helios.User

  ##########################################################################
  # Generating http-auth header:                                           #
  #     $ openssl dgst -sha256 -sign prv.pem example-commit.json | base64  #
  ##########################################################################

  test "Proper status codes on different request", %{conn: conn} do
    Repo.insert!(%User{
      user_name: "rvrx",
      public_key: File.read!("test/helios_web/controllers/events_api/pub.pem")
    })

    # All valid except the JSON body itself
    conn_1 =
      conn
      |> put_req_header("content-type", "application/json")
      |> put_req_header(
        "http-auth",
        "aXGMNYY/AetzCz2Gdmkx4VeQj5sWzEJ6cF/n0ThioysMFxnhwLjrkQJKHIjjKM6EuFu0DHQLVyvnHM6wNJylRsdT33yLFyu0+qFeAmFucCtbt7sgXsIUXHAOfKR6eTnxLjouYFW5rj3RNfcebsQZyERfPt6Jsc+A4nSk/w3M1p4PpeMOCU1IASy1eSHurpcYJlaJaRdwO5g7wbD36nygdL2lFIh/wTiOqKTo+Vys0D9a2Hcmg3dr01hNn/8sG/CLJALta3zKW763FMFJ4yJrfNgSwDB/mijl4UBBIHx0ZY0AJq8G+0lUof8gaKqAizYM9EirxH9YLaA4iI8Jo9J+Kg=="
      )
      |> post(
        Routes.events_api_path(conn, :handle, "1", user: "rvrx"),
        File.read!(
          "test/helios_web/controllers/events_api/example-commit-incorrectly-formatted.json"
        )
      )

    # Perfectly valid!
    conn_2 =
      conn
      |> put_req_header("content-type", "application/json")
      |> put_req_header(
        "http-auth",
        "cPlQ8bGl/l2CD2/F0vAyqHPv+hnWhyJSWIBaMCALfJAqWNONyk6F2FzVTLrQFwVh8UfMi4wrqwJnSjJ34I+ceFIn1K83BRjUvKMT8z5XU3jFop0+6/DOwq6XW4YV00hf8ypnNFlcIqlXFhe5CQcI0bKvX1h7xhH5NBNro7lVTMEX7br29fTb92OvvM3HULc73SDc9+0dDaNtHsRC+KMqtXRtqCm+kSIjWsXBk6bMUPKzUu+kZeMxNofKhh0ewGTKgASuD+r2mBI/U+7M4/903XkSH6yWrcWNkUF+lbYr2skNO1wVvD/SG82bTj2W9/0zpG8CbSd+68eZHVcQjkwnkw=="
      )
      |> post(
        Routes.events_api_path(conn, :handle, "0", user: "rvrx"),
        File.read!("test/helios_web/controllers/events_api/example-commit.json")
      )

    # Perfectly valid, but it is the same event as just submitted above!
    conn_3 =
      conn
      |> put_req_header("content-type", "application/json")
      |> put_req_header(
        "http-auth",
        "cPlQ8bGl/l2CD2/F0vAyqHPv+hnWhyJSWIBaMCALfJAqWNONyk6F2FzVTLrQFwVh8UfMi4wrqwJnSjJ34I+ceFIn1K83BRjUvKMT8z5XU3jFop0+6/DOwq6XW4YV00hf8ypnNFlcIqlXFhe5CQcI0bKvX1h7xhH5NBNro7lVTMEX7br29fTb92OvvM3HULc73SDc9+0dDaNtHsRC+KMqtXRtqCm+kSIjWsXBk6bMUPKzUu+kZeMxNofKhh0ewGTKgASuD+r2mBI/U+7M4/903XkSH6yWrcWNkUF+lbYr2skNO1wVvD/SG82bTj2W9/0zpG8CbSd+68eZHVcQjkwnkw=="
      )
      |> post(
        Routes.events_api_path(conn, :handle, "1", user: "rvrx"),
        File.read!("test/helios_web/controllers/events_api/example-commit.json")
      )

    conn_4 =
      conn
      |> put_req_header("content-type", "application/json")
      |> put_req_header(
        "http-auth",
        "cPlQ8bGl/l2CD2/F0vAyqHPv+hnWhyJSWIBaMCALfJAqWNONyk6F2FzVTLrQFwVh8UfMi4wrqwJnSjJ34I+ceFIn1K83BRjUvKMT8z5XU3jFop0+6/DOwq6XW4YV00hf8ypnNFlcIqlXFhe5CQcI0bKvX1h7xhH5NBNro7lVTMEX7br29fTb92OvvM3HULc73SDc9+0dDaNtHsRC+KMqtXRtqCm+kSIjWsXBk6bMUPKzUu+kZeMxNofKhh0ewGTKgASuD+r2mBI/U+7M4/903XkSH6yWrcWNkUF+lbYr2skNO1wVvD/SG82bTj2W9/0zpG8CbSd+68eZHVcQjkwnkw=="
      )
      |> post(
        Routes.events_api_path(conn, :handle, "1", user: "rvrx"),
        File.read!("test/helios_web/controllers/events_api/example-commit.json")
      )

    # The signature is incorrect for the body
    conn_5 =
      conn
      |> put_req_header("content-type", "application/json")
      |> put_req_header(
        "http-auth",
        "aXGMNYY/AetzCz2Gdmkx4VeQj56WzEJ6cf/n0ThiyysMFxnhwLjrkQJKHIjjKM6EuFu0DHQLVyvnHM6wNJylRsdT33yLFyu0+qFeAmFucCtbt7sgXsIUXHAOfKR6eTnxLjouYFW5rj3RNfcebsQZyERfPt6Jsc+A4nSk/w3M1p4PpeMOCU1IASy1eSHurpcYJlaJaRdwO5g7wbD36nygdL2lFIh/wTiOqKTo+Vys0D9a2Hcmg3dr01hNn/8sG/CLJALta3zKW763FMFJ4yJrfNgSwDB/mijl4UBBIHx0ZY0AJq8G+0lUof8gaKqAizYM9EirxH9YLaA4iI8Jo9J+Kg=="
      )
      |> post(
        Routes.events_api_path(conn, :handle, "1", user: "rvrx"),
        File.read!("test/helios_web/controllers/events_api/example-commit.json")
      )

    # The auth header is malformed
    conn_6 =
      conn
      |> put_req_header("content-type", "application/json")
      |> put_req_header(
        "http-auth",
        "thîs is ñot vãlid base64!"
      )
      |> post(
        Routes.events_api_path(conn, :handle, "1", user: "rvrx"),
        File.read!("test/helios_web/controllers/events_api/example-commit.json")
      )

    # Bad Request (Malformed)
    assert conn_1.status == 400
    assert conn_6.status == 400
    # Not Found (No endpoint at URL)
    assert conn_2.status == 404
    # Created
    assert conn_3.status == 201
    # Already Reported (Duplicate event)
    assert conn_4.status == 208
    # Unauthorized (Signature could not be verified)
    assert conn_5.status == 401
  end

  test "POST new commit", %{conn: conn} do
    Repo.insert!(%User{
      user_name: "rvrx",
      public_key: File.read!("test/helios_web/controllers/events_api/pub.pem")
    })

    conn =
      conn
      |> put_req_header("content-type", "application/json")
      |> put_req_header(
        "http-auth",
        "cPlQ8bGl/l2CD2/F0vAyqHPv+hnWhyJSWIBaMCALfJAqWNONyk6F2FzVTLrQFwVh8UfMi4wrqwJnSjJ34I+ceFIn1K83BRjUvKMT8z5XU3jFop0+6/DOwq6XW4YV00hf8ypnNFlcIqlXFhe5CQcI0bKvX1h7xhH5NBNro7lVTMEX7br29fTb92OvvM3HULc73SDc9+0dDaNtHsRC+KMqtXRtqCm+kSIjWsXBk6bMUPKzUu+kZeMxNofKhh0ewGTKgASuD+r2mBI/U+7M4/903XkSH6yWrcWNkUF+lbYr2skNO1wVvD/SG82bTj2W9/0zpG8CbSd+68eZHVcQjkwnkw=="
      )
      |> post(
        Routes.events_api_path(conn, :handle, "1", user: "rvrx"),
        File.read!("test/helios_web/controllers/events_api/example-commit.json")
      )

    assert conn.status == 201
    assert length(get_commits()) == 1
  end

  test "POST new PR", %{conn: conn} do
    Repo.insert!(%User{
      user_name: "rvrx",
      public_key: File.read!("test/helios_web/controllers/events_api/pub.pem")
    })

    conn =
      conn
      |> put_req_header("content-type", "application/json")
      |> put_req_header(
        "http-auth",
        "wSwi8IC54s6EudNlVP6dV9JznKpZ4F7Ka/p9wWauo5xr2sfLGJVi3+s/J1OZQwbBx3ZpyqP20YNB/cpMTE5u40jDpTlAHe7rc8vLkWjHmA7/8LBECXeGl1msip12D5rw9Auk88hobqRcB+wDJAccGLwCwyUv5ZJ+JZRO7W10/jeJ6mM8kzpntA2GJnwM6SbV/DyZ+vgQOwmAUf6PpnkXnWrK8t2+sKV5azKO1umAkrmEuNCV5ifKuuI1tEq9Lzpt9d5unsh0L/oQySXHBEvWDr/UOwo1VS36GgL+ccYRSwH2FAL2kqsMHJvGj63w9JbfpPL4eTxZXqw5OmyEHjffZQ=="
      )
      |> post(
        Routes.events_api_path(conn, :handle, "1", user: "rvrx"),
        File.read!("test/helios_web/controllers/events_api/example-pr.json")
      )

    assert conn.status == 201
    assert length(get_commits()) == 0
    assert length(get_prs()) == 1
  end

  test "POST multiple commits (w/ duplicate IDs) and PRs", %{conn: conn} do
    Repo.insert!(%User{
      user_name: "rvrx",
      public_key: File.read!("test/helios_web/controllers/events_api/pub.pem")
    })

    Repo.insert!(%User{
      user_name: "some1",
      public_key: File.read!("test/helios_web/controllers/events_api/pub.pem")
    })

    Repo.insert!(%User{
      user_name: "some2",
      public_key: File.read!("test/helios_web/controllers/events_api/pub.pem")
    })

    conn = conn |> put_req_header("content-type", "application/json")

    conn
    |> put_req_header(
      "http-auth",
      "yfqyBDR/8KlyuIYykmTM2DMron70axdBIOWVItEiRRfnBmO0km7PFTBcM5WytuCuAnw8nlejv0nozpccD1Nf5KODlil1AfWSaBF4DRg8M3DD/MgRCJdhG9AdBGZbAglKk0CFOqk4Bsb8FTg9mQ03d9g5K96+296FcIY0ntXWqnqrwM/x8ebuXczVqlhq8DkKrbDcAwxNDXtcqvcb1b2kcCruCGrjLyqiYSpnaI523uo+xdUhDrjgZ4bRXuwpiu5k0Qq9o9FG0ieiSFtf1IqQT8ITIpW7x7lk7i+kJkVBr15U55ej91sjjY+xjqs2nC5qVdQ302x/O7dCQiaJ3XyCnA=="
    )
    |> post(
      Routes.events_api_path(conn, :handle, "1", user: "some1"),
      File.read!("test/helios_web/controllers/events_api/0.json")
    )

    conn
    |> put_req_header(
      "http-auth",
      "JQQw0BIQyI5mNkl5MdDUHEGJO8aLgRHUn+GNAc8z+SoCSrgMf22vqwpAahy6TSNIX/327kD1SIxETTE6LtEMJ3XDueHEOtRdBwzGtE7qaBoxLn05Hcd75hVqklK4+5au9omugELZyWBTeDWMwnm7ba8GZwOMCik9cS6Xc+lWm+Ppoat5LtnOWVkJsMRwPDBfON8bfToCuWBsrUtYluDvm96Cc9VPgDstmn8AElnj9KMGoHfr9A8OAIeyFNw3xa6JW7VpQ/cZEoJ+D6eyF9gaDXcnD4lrT5bl6VjqgAdvEJfyan/RCQe3sShwsFK+sBfea2j8CdL1jIMoofxSgQHCPA=="
    )
    |> post(
      Routes.events_api_path(conn, :handle, "1", user: "some2"),
      File.read!("test/helios_web/controllers/events_api/1.json")
    )

    conn
    |> put_req_header(
      "http-auth",
      "XxhE+hMKptYwO+jWGjH1ozTNZOuuTBZo0fPCPognr6DLbbKX405I7WCJBlwH61gEUDQcGt2HcyvGeMeINm5PuAmQP88TeuTN3wFOKsBzgLz95dK402oLq4cqBsHei49rHwOoxBFMjp+OBakaxdoIKzHdqoLAhV2SdL99gBRugZfICjfhXxR0pwbxI5OYi0lOU672iKVY+ikmOPHhGGxE2LjSqrYqyOik80zBR0V+duBN9kXrkO4g7BJI2x1rENBOv7KcUPMqG9x82PqfIXh8m3Lo43CQyuWhKO/10E5p/TOJuGiP/KIr4E26yfIx1/vJ5s27xDz3ne1r8CvZ9f1mpA=="
    )
    |> post(
      Routes.events_api_path(conn, :handle, "1", user: "rvrx"),
      File.read!("test/helios_web/controllers/events_api/2.json")
    )

    conn
    |> put_req_header(
      "http-auth",
      "Eye2QVhsbCH+bdbOJCLoB8NUBcUygczGRhVfZEhZaxyS5IDFm25pBfOsXxQtXY3DdFNXnLho9LPkUvguNeAdtc5WTUc4BgSuNhyrDQ0td+iBpeps1psd4RrQmWvaZUO2qIwjVnlUIZ0+AfApnkr1bj/wgqoD5cSYtXW63VSLIEUef9Vp4mTzQ5B3ZJiaxVV26lAGL1AH7ba2bu2RT+Zee+zEMj2G7bb0FWdGSiZE/GifVzyuv9+T4H9hBmwoYi+RyLrE5jYRfKhJ6wUsZ2hAh7qf93OFQVax8NOB9jSoQtvg8PYBLkDZeQ//6QWWQGbC6WjGFBi8SWdZi8FQjTaMvg=="
    )
    |> post(
      Routes.events_api_path(conn, :handle, "1", user: "rvrx"),
      File.read!("test/helios_web/controllers/events_api/3.json")
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
