defmodule AfterGlow.VariableQuestionControllerTest do
  use AfterGlow.ConnCase

  alias AfterGlow.VariableQuestion
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
    question = Repo.insert!(%AfterGlow.Question{})
    variable = Repo.insert!(%AfterGlow.Variable{})

    %{
      "question" => %{
        "data" => %{
          "type" => "question",
          "id" => question.id
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
    conn = get conn, variable_question_path(conn, :index)
    assert json_response(conn, 200)["data"] == []
  end

  test "shows chosen resource", %{conn: conn} do
    variable_question = Repo.insert! %VariableQuestion{}
    conn = get conn, variable_question_path(conn, :show, variable_question)
    data = json_response(conn, 200)["data"]
    assert data["id"] == "#{variable_question.id}"
    assert data["type"] == "variable_question"
    assert data["attributes"]["question_id"] == variable_question.question_id
    assert data["attributes"]["variable_id"] == variable_question.variable_id
  end

  test "does not show resource and instead throw error when id is nonexistent", %{conn: conn} do
    assert_error_sent 404, fn ->
      get conn, variable_question_path(conn, :show, -1)
    end
  end

  test "creates and renders resource when data is valid", %{conn: conn} do
    conn = post conn, variable_question_path(conn, :create), %{
      "meta" => %{},
      "data" => %{
        "type" => "variable_question",
        "attributes" => @valid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 201)["data"]["id"]
    assert Repo.get_by(VariableQuestion, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, variable_question_path(conn, :create), %{
      "meta" => %{},
      "data" => %{
        "type" => "variable_question",
        "attributes" => @invalid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates and renders chosen resource when data is valid", %{conn: conn} do
    variable_question = Repo.insert! %VariableQuestion{}
    conn = put conn, variable_question_path(conn, :update, variable_question), %{
      "meta" => %{},
      "data" => %{
        "type" => "variable_question",
        "id" => variable_question.id,
        "attributes" => @valid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 200)["data"]["id"]
    assert Repo.get_by(VariableQuestion, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    variable_question = Repo.insert! %VariableQuestion{}
    conn = put conn, variable_question_path(conn, :update, variable_question), %{
      "meta" => %{},
      "data" => %{
        "type" => "variable_question",
        "id" => variable_question.id,
        "attributes" => @invalid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 422)["errors"] != %{}
  end

  test "deletes chosen resource", %{conn: conn} do
    variable_question = Repo.insert! %VariableQuestion{}
    conn = delete conn, variable_question_path(conn, :delete, variable_question)
    assert response(conn, 204)
    refute Repo.get(VariableQuestion, variable_question.id)
  end

end
