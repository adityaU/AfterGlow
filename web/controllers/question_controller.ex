defmodule SimpleBase.QuestionController do
  use SimpleBase.Web, :controller

  alias SimpleBase.Question
  alias JaSerializer.Params

  plug :scrub_params, "data" when action in [:create, :update]

  def index(conn, _params) do
    questions = Repo.all(Question)
    render(conn, "index.json-api", data: questions)
  end

  def create(conn, %{"data" => data = %{"type" => "question", "attributes" => _question_params}}) do
    changeset = Question.changeset(%Question{}, Params.to_attributes(data))

    case Repo.insert(changeset) do
      {:ok, question} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", question_path(conn, :show, question))
        |> render("show.json-api", data: question)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:errors, data: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    question = Repo.get!(Question, id)
    render(conn, "show.json-api", data: question)
  end

  def update(conn, %{"id" => id, "data" => data = %{"type" => "question", "attributes" => _question_params}}) do
    question = Repo.get!(Question, id)
    changeset = Question.changeset(question, Params.to_attributes(data))

    case Repo.update(changeset) do
      {:ok, question} ->
        render(conn, "show.json-api", data: question)
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

end
