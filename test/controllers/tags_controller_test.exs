defmodule AfterGlow.TagsControllerTest do
  use AfterGlow.ConnCase

  alias AfterGlow.Tags
  alias AfterGlow.Repo

  @valid_attrs %{description: "some content", name: "some content"}
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
    conn = get conn, tags_path(conn, :index)
    assert json_response(conn, 200)["data"] == []
  end

  test "shows chosen resource", %{conn: conn} do
    tags = Repo.insert! %Tags{}
    conn = get conn, tags_path(conn, :show, tags)
    data = json_response(conn, 200)["data"]
    assert data["id"] == "#{tags.id}"
    assert data["type"] == "tags"
    assert data["attributes"]["name"] == tags.name
    assert data["attributes"]["description"] == tags.description
  end

  test "does not show resource and instead throw error when id is nonexistent", %{conn: conn} do
    assert_error_sent 404, fn ->
      get conn, tags_path(conn, :show, -1)
    end
  end

  test "creates and renders resource when data is valid", %{conn: conn} do
    conn = post conn, tags_path(conn, :create), %{
      "meta" => %{},
      "data" => %{
        "type" => "tags",
        "attributes" => @valid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 201)["data"]["id"]
    assert Repo.get_by(Tags, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, tags_path(conn, :create), %{
      "meta" => %{},
      "data" => %{
        "type" => "tags",
        "attributes" => @invalid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates and renders chosen resource when data is valid", %{conn: conn} do
    tags = Repo.insert! %Tags{}
    conn = put conn, tags_path(conn, :update, tags), %{
      "meta" => %{},
      "data" => %{
        "type" => "tags",
        "id" => tags.id,
        "attributes" => @valid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 200)["data"]["id"]
    assert Repo.get_by(Tags, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    tags = Repo.insert! %Tags{}
    conn = put conn, tags_path(conn, :update, tags), %{
      "meta" => %{},
      "data" => %{
        "type" => "tags",
        "id" => tags.id,
        "attributes" => @invalid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 422)["errors"] != %{}
  end

  test "deletes chosen resource", %{conn: conn} do
    tags = Repo.insert! %Tags{}
    conn = delete conn, tags_path(conn, :delete, tags)
    assert response(conn, 204)
    refute Repo.get(Tags, tags.id)
  end

end
