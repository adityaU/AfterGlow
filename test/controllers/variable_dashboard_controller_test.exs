defmodule AfterGlow.VariableDashboardControllerTest do
  use AfterGlow.ConnCase

  alias AfterGlow.VariableDashboard
  alias AfterGlow.Repo

  @valid_attrs %{}
  @invalid_attrs %{}

  setup do
    conn = build_conn()
      |> put_req_header("accept", "application/vnd.api+json")
      |> put_req_header("content-type", "application/vnd.api+json")

    {:ok, conn: conn}
  end
  
  defp relationships do 
    dashboard = Repo.insert!(%AfterGlow.Dashboard{})
    variable = Repo.insert!(%AfterGlow.Variable{})

    %{
      "dashboard" => %{
        "data" => %{
          "type" => "dashboard",
          "id" => dashboard.id
        }
      },
      "variable" => %{
        "data" => %{
          "type" => "variable",
          "id" => variable.id
        }
      },
    }
  end

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, variable_dashboard_path(conn, :index)
    assert json_response(conn, 200)["data"] == []
  end

  test "shows chosen resource", %{conn: conn} do
    variable_dashboard = Repo.insert! %VariableDashboard{}
    conn = get conn, variable_dashboard_path(conn, :show, variable_dashboard)
    data = json_response(conn, 200)["data"]
    assert data["id"] == "#{variable_dashboard.id}"
    assert data["type"] == "variable_dashboard"
    assert data["attributes"]["dashboard_id"] == variable_dashboard.dashboard_id
    assert data["attributes"]["variable_id"] == variable_dashboard.variable_id
  end

  test "does not show resource and instead throw error when id is nonexistent", %{conn: conn} do
    assert_error_sent 404, fn ->
      get conn, variable_dashboard_path(conn, :show, -1)
    end
  end

  test "creates and renders resource when data is valid", %{conn: conn} do
    conn = post conn, variable_dashboard_path(conn, :create), %{
      "meta" => %{},
      "data" => %{
        "type" => "variable_dashboard",
        "attributes" => @valid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 201)["data"]["id"]
    assert Repo.get_by(VariableDashboard, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, variable_dashboard_path(conn, :create), %{
      "meta" => %{},
      "data" => %{
        "type" => "variable_dashboard",
        "attributes" => @invalid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates and renders chosen resource when data is valid", %{conn: conn} do
    variable_dashboard = Repo.insert! %VariableDashboard{}
    conn = put conn, variable_dashboard_path(conn, :update, variable_dashboard), %{
      "meta" => %{},
      "data" => %{
        "type" => "variable_dashboard",
        "id" => variable_dashboard.id,
        "attributes" => @valid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 200)["data"]["id"]
    assert Repo.get_by(VariableDashboard, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    variable_dashboard = Repo.insert! %VariableDashboard{}
    conn = put conn, variable_dashboard_path(conn, :update, variable_dashboard), %{
      "meta" => %{},
      "data" => %{
        "type" => "variable_dashboard",
        "id" => variable_dashboard.id,
        "attributes" => @invalid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 422)["errors"] != %{}
  end

  test "deletes chosen resource", %{conn: conn} do
    variable_dashboard = Repo.insert! %VariableDashboard{}
    conn = delete conn, variable_dashboard_path(conn, :delete, variable_dashboard)
    assert response(conn, 204)
    refute Repo.get(VariableDashboard, variable_dashboard.id)
  end

end
