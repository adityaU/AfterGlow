defmodule SimpleBase.TableControllerTest do
  use SimpleBase.ConnCase

  alias SimpleBase.Table
  alias SimpleBase.Repo

  @valid_attrs %{name: "some content"}
  @invalid_attrs %{}

  setup do
    conn = build_conn()
      |> put_req_header("accept", "application/vnd.api+json")
      |> put_req_header("content-type", "application/vnd.api+json")

    {:ok, conn: conn}
  end
  
  defp relationships do 
    database = Repo.insert!(%SimpleBase.Database{})

    %{
      "database" => %{
        "data" => %{
          "type" => "database",
          "id" => database.id
        }
      },
    }
  end

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, table_path(conn, :index)
    assert json_response(conn, 200)["data"] == []
  end

  test "shows chosen resource", %{conn: conn} do
    table = Repo.insert! %Table{}
    conn = get conn, table_path(conn, :show, table)
    data = json_response(conn, 200)["data"]
    assert data["id"] == "#{table.id}"
    assert data["type"] == "table"
    assert data["attributes"]["name"] == table.name
    assert data["attributes"]["database_id"] == table.database_id
  end

  test "does not show resource and instead throw error when id is nonexistent", %{conn: conn} do
    assert_error_sent 404, fn ->
      get conn, table_path(conn, :show, -1)
    end
  end

  test "creates and renders resource when data is valid", %{conn: conn} do
    conn = post conn, table_path(conn, :create), %{
      "meta" => %{},
      "data" => %{
        "type" => "table",
        "attributes" => @valid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 201)["data"]["id"]
    assert Repo.get_by(Table, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, table_path(conn, :create), %{
      "meta" => %{},
      "data" => %{
        "type" => "table",
        "attributes" => @invalid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates and renders chosen resource when data is valid", %{conn: conn} do
    table = Repo.insert! %Table{}
    conn = put conn, table_path(conn, :update, table), %{
      "meta" => %{},
      "data" => %{
        "type" => "table",
        "id" => table.id,
        "attributes" => @valid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 200)["data"]["id"]
    assert Repo.get_by(Table, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    table = Repo.insert! %Table{}
    conn = put conn, table_path(conn, :update, table), %{
      "meta" => %{},
      "data" => %{
        "type" => "table",
        "id" => table.id,
        "attributes" => @invalid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 422)["errors"] != %{}
  end

  test "deletes chosen resource", %{conn: conn} do
    table = Repo.insert! %Table{}
    conn = delete conn, table_path(conn, :delete, table)
    assert response(conn, 204)
    refute Repo.get(Table, table.id)
  end

end
