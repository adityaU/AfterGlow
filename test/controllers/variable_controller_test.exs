defmodule AfterGlow.VariableControllerTest do
  use AfterGlow.ConnCase

  alias AfterGlow.Variable
  alias AfterGlow.Repo

  @valid_attrs %{default: "some content", name: "some content"}
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
    conn = get conn, variable_path(conn, :index)
    assert json_response(conn, 200)["data"] == []
  end

  test "shows chosen resource", %{conn: conn} do
    variable = Repo.insert! %Variable{}
    conn = get conn, variable_path(conn, :show, variable)
    data = json_response(conn, 200)["data"]
    assert data["id"] == "#{variable.id}"
    assert data["type"] == "variable"
    assert data["attributes"]["name"] == variable.name
    assert data["attributes"]["default"] == variable.default
  end

  test "does not show resource and instead throw error when id is nonexistent", %{conn: conn} do
    assert_error_sent 404, fn ->
      get conn, variable_path(conn, :show, -1)
    end
  end

  test "creates and renders resource when data is valid", %{conn: conn} do
    conn = post conn, variable_path(conn, :create), %{
      "meta" => %{},
      "data" => %{
        "type" => "variable",
        "attributes" => @valid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 201)["data"]["id"]
    assert Repo.get_by(Variable, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, variable_path(conn, :create), %{
      "meta" => %{},
      "data" => %{
        "type" => "variable",
        "attributes" => @invalid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates and renders chosen resource when data is valid", %{conn: conn} do
    variable = Repo.insert! %Variable{}
    conn = put conn, variable_path(conn, :update, variable), %{
      "meta" => %{},
      "data" => %{
        "type" => "variable",
        "id" => variable.id,
        "attributes" => @valid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 200)["data"]["id"]
    assert Repo.get_by(Variable, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    variable = Repo.insert! %Variable{}
    conn = put conn, variable_path(conn, :update, variable), %{
      "meta" => %{},
      "data" => %{
        "type" => "variable",
        "id" => variable.id,
        "attributes" => @invalid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 422)["errors"] != %{}
  end

  test "deletes chosen resource", %{conn: conn} do
    variable = Repo.insert! %Variable{}
    conn = delete conn, variable_path(conn, :delete, variable)
    assert response(conn, 204)
    refute Repo.get(Variable, variable.id)
  end

end
