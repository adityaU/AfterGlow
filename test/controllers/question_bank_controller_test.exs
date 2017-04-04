defmodule AfterGlow.QuestionBankControllerTest do
  use AfterGlow.ConnCase

  alias AfterGlow.QuestionBank
  alias AfterGlow.Repo

  @valid_attrs %{questions: [], title: "some content"}
  @invalid_attrs %{}

  setup do
    conn = build_conn()
      |> put_req_header("accept", "application/vnd.api+json")
      |> put_req_header("content-type", "application/vnd.api+json")

    {:ok, conn: conn}
  end
  
  defp relationships do 
    questions = Repo.insert!(%AfterGlow.Questions{})

    %{
      "questions" => %{
        "data" => %{
          "type" => "questions",
          "id" => questions.id
        }
      },
    }
  end

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, question_bank_path(conn, :index)
    assert json_response(conn, 200)["data"] == []
  end

  test "shows chosen resource", %{conn: conn} do
    question_bank = Repo.insert! %QuestionBank{}
    conn = get conn, question_bank_path(conn, :show, question_bank)
    data = json_response(conn, 200)["data"]
    assert data["id"] == "#{question_bank.id}"
    assert data["type"] == "question_bank"
    assert data["attributes"]["title"] == question_bank.title
    assert data["attributes"]["questions"] == question_bank.questions
  end

  test "does not show resource and instead throw error when id is nonexistent", %{conn: conn} do
    assert_error_sent 404, fn ->
      get conn, question_bank_path(conn, :show, -1)
    end
  end

  test "creates and renders resource when data is valid", %{conn: conn} do
    conn = post conn, question_bank_path(conn, :create), %{
      "meta" => %{},
      "data" => %{
        "type" => "question_bank",
        "attributes" => @valid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 201)["data"]["id"]
    assert Repo.get_by(QuestionBank, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, question_bank_path(conn, :create), %{
      "meta" => %{},
      "data" => %{
        "type" => "question_bank",
        "attributes" => @invalid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 422)["errors"] != %{}
  end

  test "updates and renders chosen resource when data is valid", %{conn: conn} do
    question_bank = Repo.insert! %QuestionBank{}
    conn = put conn, question_bank_path(conn, :update, question_bank), %{
      "meta" => %{},
      "data" => %{
        "type" => "question_bank",
        "id" => question_bank.id,
        "attributes" => @valid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 200)["data"]["id"]
    assert Repo.get_by(QuestionBank, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    question_bank = Repo.insert! %QuestionBank{}
    conn = put conn, question_bank_path(conn, :update, question_bank), %{
      "meta" => %{},
      "data" => %{
        "type" => "question_bank",
        "id" => question_bank.id,
        "attributes" => @invalid_attrs,
        "relationships" => relationships
      }
    }

    assert json_response(conn, 422)["errors"] != %{}
  end

  test "deletes chosen resource", %{conn: conn} do
    question_bank = Repo.insert! %QuestionBank{}
    conn = delete conn, question_bank_path(conn, :delete, question_bank)
    assert response(conn, 204)
    refute Repo.get(QuestionBank, question_bank.id)
  end

end
