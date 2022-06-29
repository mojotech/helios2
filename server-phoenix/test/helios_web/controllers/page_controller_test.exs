defmodule HeliosWeb.PageControllerTest do
  use HeliosWeb.ConnCase

  test "GET /", %{conn: conn} do
    conn = get(conn, "/")
    assert html_response(conn, 200) =~ "Sign in with Google"
  end

  test "GET /Boulder", %{conn: conn} do
    conn = get(conn, "/Boulder")
    assert html_response(conn, 200) =~ "Helios2"
  end

  test "GET /Providence", %{conn: conn} do
    conn = get(conn, "/Providence")
    assert html_response(conn, 200) =~ "Helios2"
  end
end
