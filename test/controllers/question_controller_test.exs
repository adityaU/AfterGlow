defmodule AfterGlow.QuestionControllerTest do
  use AfterGlow.ConnCase

  alias AfterGlow.Question
  alias AfterGlow.Repo

  @valid_attrs %{human_sql: %{}, last_updated: %{day: 17, hour: 14, min: 0, month: 4, sec: 0, year: 2010}, sql: "some content", title: "some content", update_interval: 42}
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
    conn = get conn, question_path(conn, :index)
    assert json_response(conn, 200)["data"] == []
  end

  test "shows chosen resource", %{conn: conn} do
    question = Repo.insert! %Question{}
    conn = get conn, question_path(conn, :show, question)
    data = json_response(conn, 200)["data"]
    assert data["id"] == "#{question.id}"
    assert data["type"] == "question"
    assert data["attributes"]["title"] == question.title
    assert data["attributes"]["update_interval"] == question.update_interval
    assert data["attributes"]["last_updated"] == question.last_updated
    assert data["attributes"]["sql"] == question.sql
    assert data["attributes"]["human_sql"] == question.human_sql
  end

  test "does not show resource and instead throw error when id is nonexistent", %{conn: conn} do
    assert_error_sent 404, fn ->
      get conn, question_path(conn, :show, -1)
    end
  end

  test "creates and renders resource when data is valid", %{conn: conn} do
    conn = post conn, question_path(conn, :create), %{
      "meta" => %{},
      "data" => %{
        "type" => "question",
        "attributes" => @valid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 201)["data"]["id"]
    assert Repo.get_by(Question, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, question_path(conn, :create), %{
      "meta" => %{},
      "data" => %{
        "type" => "question",
        "attributes" => @invalid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates and renders chosen resource when data is valid", %{conn: conn} do
    question = Repo.insert! %Question{}
    conn = put conn, question_path(conn, :update, question), %{
      "meta" => %{},
      "data" => %{
        "type" => "question",
        "id" => question.id,
        "attributes" => @valid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 200)["data"]["id"]
    assert Repo.get_by(Question, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    question = Repo.insert! %Question{}
    conn = put conn, question_path(conn, :update, question), %{
      "meta" => %{},
      "data" => %{
        "type" => "question",
        "id" => question.id,
        "attributes" => @invalid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 422)["errors"] != %{}
  end

  test "deletes chosen resource", %{conn: conn} do
    question = Repo.insert! %Question{}
    conn = delete conn, question_path(conn, :delete, question)
    assert response(conn, 204)
    refute Repo.get(Question, question.id)
  end

end
