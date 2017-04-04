defmodule AfterGlow.ColumnControllerTest do
  use AfterGlow.ConnCase

  alias AfterGlow.Column
  alias AfterGlow.Repo

  @valid_attrs %{name: "some content", type: "some content"}
  @invalid_attrs %{}

  setup do
    conn = build_conn()
      |> put_req_header("accept", "application/vnd.api+json")
      |> put_req_header("content-type", "application/vnd.api+json")

    {:ok, conn: conn}
  end
  
  defp relationships do 
    table = Repo.insert!(%AfterGlow.Table{})

    %{
      "table" => %{
        "data" => %{
          "type" => "table",
          "id" => table.id
        }
      },
    }
  end

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, column_path(conn, :index)
    assert json_response(conn, 200)["data"] == []
  end

  test "shows chosen resource", %{conn: conn} do
    column = Repo.insert! %Column{}
    conn = get conn, column_path(conn, :show, column)
    data = json_response(conn, 200)["data"]
    assert data["id"] == "#{column.id}"
    assert data["type"] == "column"
    assert data["attributes"]["name"] == column.name
    assert data["attributes"]["type"] == column.type
    assert data["attributes"]["table_id"] == column.table_id
  end

  test "does not show resource and instead throw error when id is nonexistent", %{conn: conn} do
    assert_error_sent 404, fn ->
      get conn, column_path(conn, :show, -1)
    end
  end

  test "creates and renders resource when data is valid", %{conn: conn} do
    conn = post conn, column_path(conn, :create), %{
      "meta" => %{},
      "data" => %{
        "type" => "column",
        "attributes" => @valid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 201)["data"]["id"]
    assert Repo.get_by(Column, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, column_path(conn, :create), %{
      "meta" => %{},
      "data" => %{
        "type" => "column",
        "attributes" => @invalid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates and renders chosen resource when data is valid", %{conn: conn} do
    column = Repo.insert! %Column{}
    conn = put conn, column_path(conn, :update, column), %{
      "meta" => %{},
      "data" => %{
        "type" => "column",
        "id" => column.id,
        "attributes" => @valid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 200)["data"]["id"]
    assert Repo.get_by(Column, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    column = Repo.insert! %Column{}
    conn = put conn, column_path(conn, :update, column), %{
      "meta" => %{},
      "data" => %{
        "type" => "column",
        "id" => column.id,
        "attributes" => @invalid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 422)["errors"] != %{}
  end

  test "deletes chosen resource", %{conn: conn} do
    column = Repo.insert! %Column{}
    conn = delete conn, column_path(conn, :delete, column)
    assert response(conn, 204)
    refute Repo.get(Column, column.id)
  end

end
