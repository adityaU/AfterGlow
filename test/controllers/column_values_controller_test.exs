defmodule SimpleBase.ColumnValuesControllerTest do
  use SimpleBase.ConnCase

  alias SimpleBase.ColumnValues
  alias SimpleBase.Repo

  @valid_attrs %{name: "some content", value: "some content"}
  @invalid_attrs %{}

  setup do
    conn = build_conn()
      |> put_req_header("accept", "application/vnd.api+json")
      |> put_req_header("content-type", "application/vnd.api+json")

    {:ok, conn: conn}
  end
  
  defp relationships do 
    column = Repo.insert!(%SimpleBase.Column{})

    %{
      "column" => %{
        "data" => %{
          "type" => "column",
          "id" => column.id
        }
      },
    }
  end

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, column_values_path(conn, :index)
    assert json_response(conn, 200)["data"] == []
  end

  test "shows chosen resource", %{conn: conn} do
    column_values = Repo.insert! %ColumnValues{}
    conn = get conn, column_values_path(conn, :show, column_values)
    data = json_response(conn, 200)["data"]
    assert data["id"] == "#{column_values.id}"
    assert data["type"] == "column_values"
    assert data["attributes"]["name"] == column_values.name
    assert data["attributes"]["value"] == column_values.value
    assert data["attributes"]["column_id"] == column_values.column_id
  end

  test "does not show resource and instead throw error when id is nonexistent", %{conn: conn} do
    assert_error_sent 404, fn ->
      get conn, column_values_path(conn, :show, -1)
    end
  end

  test "creates and renders resource when data is valid", %{conn: conn} do
    conn = post conn, column_values_path(conn, :create), %{
      "meta" => %{},
      "data" => %{
        "type" => "column_values",
        "attributes" => @valid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 201)["data"]["id"]
    assert Repo.get_by(ColumnValues, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, column_values_path(conn, :create), %{
      "meta" => %{},
      "data" => %{
        "type" => "column_values",
        "attributes" => @invalid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates and renders chosen resource when data is valid", %{conn: conn} do
    column_values = Repo.insert! %ColumnValues{}
    conn = put conn, column_values_path(conn, :update, column_values), %{
      "meta" => %{},
      "data" => %{
        "type" => "column_values",
        "id" => column_values.id,
        "attributes" => @valid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 200)["data"]["id"]
    assert Repo.get_by(ColumnValues, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    column_values = Repo.insert! %ColumnValues{}
    conn = put conn, column_values_path(conn, :update, column_values), %{
      "meta" => %{},
      "data" => %{
        "type" => "column_values",
        "id" => column_values.id,
        "attributes" => @invalid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 422)["errors"] != %{}
  end

  test "deletes chosen resource", %{conn: conn} do
    column_values = Repo.insert! %ColumnValues{}
    conn = delete conn, column_values_path(conn, :delete, column_values)
    assert response(conn, 204)
    refute Repo.get(ColumnValues, column_values.id)
  end

end
