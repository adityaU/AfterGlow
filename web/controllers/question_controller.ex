require IEx
defmodule AfterGlow.QuestionController do
  use AfterGlow.Web, :controller

  alias AfterGlow.Question
  alias AfterGlow.Database
  alias AfterGlow.QueryView
  alias AfterGlow.Sql.DbConnection
  alias JaSerializer.Params

  alias AfterGlow.Plugs.Authorization
  plug Authorization
  plug :authorize!, Question
  plug :scrub_params, "data" when action in [:create, :update]
  plug :verify_authorized

  def index(conn, %{"filter" => %{"id" => ids}}) do
    ids = ids |> String.split(",")
    questions = Repo.all(from q in Question, where: q.id in ^ids) |> Repo.preload(:dashboards) 
    render(conn, :index, data: questions)
  end
  def index(conn, _params) do
    questions = Repo.all(Question)|> Repo.preload(:dashboards) 
    render(conn, :index, data: questions)
  end

  def create(conn, %{"data" => data = %{"type" => "questions", "attributes" => _question_params}}) do
    changeset = Question.changeset(%Question{}, Params.to_attributes(data))

    case Repo.insert(changeset) do
      {:ok, question} ->
        question = question |> Repo.preload(:dashboards)
        conn
        |> put_status(:created)
        |> put_resp_header("location", question_path(conn, :show, question))
        |> render(:show, data: question)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:errors, data: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    question = Repo.get!(Question, id) |> Repo.preload(:dashboards)
    render(conn, :show, data: question)
  end

  def update(conn, %{"id" => id, "data" => data = %{"type" => "questions", "attributes" => _question_params}}) do
    question = Repo.get!(Question, id)
    changeset = Question.changeset(question, Params.to_attributes(data))

    case Repo.update(changeset) do
      {:ok, question} ->
        question = question |> Repo.preload(:dashboards)
        render(conn, :show, data: question)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:errors, data: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    question = Repo.get!(Question, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(question)

    send_resp(conn, :no_content, "")
  end

  def results(conn, %{"id" => id}) do
    question = Repo.one(from q in Question, where: q.id == ^id)
    db_identifier = question.human_sql["database"]["unique_identifier"]
    db_record = Repo.one(from d in Database, where: d.unique_identifier == ^db_identifier) 
    results = DbConnection.execute(db_record |> Map.from_struct, question.sql)

    case results do
      {:ok, results} ->
        question |> Question.update_columns(results.columns)
        conn
        |> render QueryView, "execute.json", data: results, query: question.sql
      {:error, error} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render QueryView, "execute.json", error: error, query: question.sql
    end
  end

end
