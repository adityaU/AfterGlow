defmodule AfterGlow.DashboardControllerTest do
  use AfterGlow.ConnCase

  alias AfterGlow.Dashboard
  alias AfterGlow.Repo

  @valid_attrs %{last_updated: %{day: 17, hour: 14, min: 0, month: 4, sec: 0, year: 2010}, title: "some content", update_interval: 42}
  @invalid_attrs %{}

  setup do
    conn = build_conn()
      |> put_req_header("accept", "application/vnd.api+json")
      |> put_req_header("content-type", "application/vnd.api+json")

    {:ok, conn: conn}
  end
  
  defp relationships do
    %{}
  end

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, dashboard_path(conn, :index)
    assert json_response(conn, 200)["data"] == []
  end

  test "shows chosen resource", %{conn: conn} do
    dashboard = Repo.insert! %Dashboard{}
    conn = get conn, dashboard_path(conn, :show, dashboard)
    data = json_response(conn, 200)["data"]
    assert data["id"] == "#{dashboard.id}"
    assert data["type"] == "dashboard"
    assert data["attributes"]["title"] == dashboard.title
    assert data["attributes"]["update_interval"] == dashboard.update_interval
    assert data["attributes"]["last_updated"] == dashboard.last_updated
  end

  test "does not show resource and instead throw error when id is nonexistent", %{conn: conn} do
    assert_error_sent 404, fn ->
      get conn, dashboard_path(conn, :show, -1)
    end
  end

  test "creates and renders resource when data is valid", %{conn: conn} do
    conn = post conn, dashboard_path(conn, :create), %{
      "meta" => %{},
      "data" => %{
        "type" => "dashboard",
        "attributes" => @valid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 201)["data"]["id"]
    assert Repo.get_by(Dashboard, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, dashboard_path(conn, :create), %{
      "meta" => %{},
      "data" => %{
        "type" => "dashboard",
        "attributes" => @invalid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates and renders chosen resource when data is valid", %{conn: conn} do
    dashboard = Repo.insert! %Dashboard{}
    conn = put conn, dashboard_path(conn, :update, dashboard), %{
      "meta" => %{},
      "data" => %{
        "type" => "dashboard",
        "id" => dashboard.id,
        "attributes" => @valid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 200)["data"]["id"]
    assert Repo.get_by(Dashboard, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    dashboard = Repo.insert! %Dashboard{}
    conn = put conn, dashboard_path(conn, :update, dashboard), %{
      "meta" => %{},
      "data" => %{
        "type" => "dashboard",
        "id" => dashboard.id,
        "attributes" => @invalid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 422)["errors"] != %{}
  end

  test "deletes chosen resource", %{conn: conn} do
    dashboard = Repo.insert! %Dashboard{}
    conn = delete conn, dashboard_path(conn, :delete, dashboard)
    assert response(conn, 204)
    refute Repo.get(Dashboard, dashboard.id)
  end

end
