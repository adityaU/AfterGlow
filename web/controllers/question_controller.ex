defmodule AfterGlow.QuestionController do
  use AfterGlow.Web, :controller

  alias AfterGlow.Question
  alias AfterGlow.Database
  alias AfterGlow.TagQuestion
  alias AfterGlow.Tag
  alias AfterGlow.Async
  alias AfterGlow.QueryView
  alias AfterGlow.Sql.DbConnection
  alias AfterGlow.QuestionSearchView
  alias JaSerializer.Params
  alias AfterGlow.CacheWrapper
  alias AfterGlow.CacheWrapper.Repo

  import Ecto.Query

  alias AfterGlow.Plugs.Authorization
  plug Authorization
  plug :authorize!, Question
  plug :scrub_params, "data" when action in [:create, :update]
  plug :verify_authorized

  def index(conn, %{"filter" => %{"id" => ids}}) do
    ids = ids |> String.split(",")
    questions = scope(conn, (from q in Question,
          where: q.id in ^ids
        )
    )
    |> select([:id])
    |> Repo.all()
    |> Enum.map(fn x -> x.id end)
    |> CacheWrapper.get_by_ids(Question)
    |> Repo.preload(:dashboards)
    |> Repo.preload(:tags)
    |> Repo.preload(:variables)
    |> Repo.preload(:snapshots)
    conn
    |> render(:index, data: questions)
  end
  def index(conn, %{"q" => query, "tag" => tag_id}) do
    search_query = from q in Question,
      where: ilike(q.title, ^"%#{query}%"),
      order_by: q.updated_at,
      limit: 10

    if tag_id && tag_id !="" do
      search_query = search_query
      |> join(:left, [q],  tq in TagQuestion, q.id == tq.question_id)
      |> where([q, tq], tq.tag_id == ^tag_id)
    end
    questions = scope(conn, search_query)
    |> select([:id])
    |> Repo.all()
    |> Enum.map(fn x -> x.id end)
    |> CacheWrapper.get_by_ids(Question)
    |> Repo.preload(:dashboards)
    |> Repo.preload(:tags)
    |> Repo.preload(:variables)
    |> Repo.preload(:snapshots)
    json conn, QuestionSearchView
    |> JaSerializer.format(questions, conn, type: 'question')
  end

  def index(conn, %{"for_variable" => "true", "query" => query}) do
    search_query = from q in Question,
      where: fragment("cardinality(columns) = 2"),
      order_by: q.updated_at,
      limit: 10
    if query && query != "" do
      search_query = search_query
      |> where([q], ilike(q.title, ^"%#{query}%"))
    end
    questions = scope(conn, search_query)
    |> select([:id])
    |> Repo.all()
    |> Enum.map(fn x -> x.id end)
    |> CacheWrapper.get_by_ids(Question)
    |> Repo.preload(:dashboards)
    |> Repo.preload(:tags)
    |> Repo.preload(:variables)
    |> Repo.preload(:snapshots)
    json conn, QuestionSearchView
    |> JaSerializer.format(questions, conn, type: 'question')
  end
  def index(conn, _params) do
    questions = scope(conn, (from q in Question,
          limit: 20,
          order_by: q.updated_at
        )
    )
    |> select([:id])
    |> Repo.all()
    |> Enum.map(fn x -> x.id end)
    |> CacheWrapper.get_by_ids(Question)
    |> Repo.preload(:dashboards)
    |> Repo.preload(:tags)
    |> Repo.preload(:variables)
    |> Repo.preload(:snapshots)
    json conn, QuestionSearchView
    |> JaSerializer.format(questions, conn, type: 'question')
  end

  def create(conn, %{"data" => data = %{"type" => "questions", "attributes" => _question_params}}) do
    prms = Params.to_attributes(data)
    prms = prms
    |> Map.merge(%{"owner_id" => conn.assigns.current_user.id})

    changeset = Question.changeset(%Question{}, prms)

    case Repo.insert_with_cache(changeset) do
      {:ok, question} ->
        question = question
        |> Repo.preload(:dashboards)
        |> Repo.preload(:tags)
        |> Repo.preload(:variables)
        |> Repo.preload(:snapshots)
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
    question = scope(conn, Question)
    |> select([:id])
    |> Repo.get!(id)
    question = CacheWrapper.get_by_id(question.id, Question)
    |> Repo.preload(:dashboards)
    |> Repo.preload(:tags)
    |> Repo.preload(:variables)
    |> Repo.preload(:snapshots)
    render(conn, :show, data: question)
  end

  def update(conn, %{"id" => id, "data" => data = %{"type" => "questions", "attributes" => _question_params}}) do
    prms = Params.to_attributes(data)
    question =  scope(conn, Question)
    |> Repo.get!(id)
    |> Repo.preload(:dashboards)
    |> Repo.preload(:tags)
    |> Repo.preload(:variables)
    |> Repo.preload(:snapshots)
    changeset = Question.changeset(question, prms)
    tag_ids = prms["tags_ids"]
    tags = if tag_ids |> Enum.empty? , do: nil, else: Repo.all(from q in Tag, where: q.id in ^tag_ids )

    case Question.update(changeset, tags) do
      {:ok, question} ->
        question = question |> Repo.preload(:dashboards) |> Repo.preload(:tags) |> Repo.preload(:variables)
        render(conn, :show, data: question)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:errors, data: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    question = scope(conn, Question) |>  Repo.get!(id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete_with_cache(question)

    send_resp(conn, :no_content, "")
  end


  def results(conn, %{"id" => id, "variables" => variables}) do
    question =  scope(conn, (from q in Question, where: q.id == ^id)) |> Repo.one() |> Repo.preload(:variables)
    db_identifier = question.human_sql["database"]["unique_identifier"]
    db_record = Repo.one(from d in Database, where: d.unique_identifier == ^db_identifier)
    query = Question.replace_variables(question.sql, question.variables , variables)
    variables_replaced_query = if question.sql != query,  do: query, else: nil
    results = DbConnection.execute(db_record |> Map.from_struct, query )
    results = results |> Question.insert_variables_replaced_at_query(variables_replaced_query)

    case results do
      {:ok, results} ->
        Async.perform(&Question.cache_results/3, [question, variables, results])
        conn
        |> render QueryView, "execute.json", data: results, query: question.sql
      {:error, error} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render QueryView, "execute.json", error: error, query: question.sql
    end
  end
end
