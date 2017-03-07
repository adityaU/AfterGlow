defmodule SimpleBase.DatabaseControllerTest do
  use SimpleBase.ConnCase

  alias SimpleBase.Database
  alias SimpleBase.Repo

  @valid_attrs %{config: %{}, name: "some content", type: "some content"}
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
    conn = get conn, database_path(conn, :index)
    assert json_response(conn, 200)["data"] == []
  end

  test "shows chosen resource", %{conn: conn} do
    database = Repo.insert! %Database{}
    conn = get conn, database_path(conn, :show, database)
    data = json_response(conn, 200)["data"]
    assert data["id"] == "#{database.id}"
    assert data["type"] == "database"
    assert data["attributes"]["name"] == database.name
    assert data["attributes"]["type"] == database.type
    assert data["attributes"]["config"] == database.config
  end

  test "does not show resource and instead throw error when id is nonexistent", %{conn: conn} do
    assert_error_sent 404, fn ->
      get conn, database_path(conn, :show, -1)
    end
  end

  test "creates and renders resource when data is valid", %{conn: conn} do
    conn = post conn, database_path(conn, :create), %{
      "meta" => %{},
      "data" => %{
        "type" => "database",
        "attributes" => @valid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 201)["data"]["id"]
    assert Repo.get_by(Database, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, database_path(conn, :create), %{
      "meta" => %{},
      "data" => %{
        "type" => "database",
        "attributes" => @invalid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates and renders chosen resource when data is valid", %{conn: conn} do
    database = Repo.insert! %Database{}
    conn = put conn, database_path(conn, :update, database), %{
      "meta" => %{},
      "data" => %{
        "type" => "database",
        "id" => database.id,
        "attributes" => @valid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 200)["data"]["id"]
    assert Repo.get_by(Database, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    database = Repo.insert! %Database{}
    conn = put conn, database_path(conn, :update, database), %{
      "meta" => %{},
      "data" => %{
        "type" => "database",
        "id" => database.id,
        "attributes" => @invalid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 422)["errors"] != %{}
  end

  test "deletes chosen resource", %{conn: conn} do
    database = Repo.insert! %Database{}
    conn = delete conn, database_path(conn, :delete, database)
    assert response(conn, 204)
    refute Repo.get(Database, database.id)
  end

end
