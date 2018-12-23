defmodule AfterGlow.QuestionController do
  use AfterGlow.Web, :controller

  alias AfterGlow.Question
  alias AfterGlow.Database
  alias AfterGlow.TagQuestion
  alias AfterGlow.Tag
  alias AfterGlow.Widgets.Widget
  alias AfterGlow.QueryView
  alias AfterGlow.QuestionSearchView
  alias JaSerializer.Params
  alias AfterGlow.CacheWrapper
  alias AfterGlow.CacheWrapper.Repo
  import AfterGlow.Sql.QueryRunner
  alias AfterGlow.Snapshots.Snapshot

  import Ecto.Query

  alias AfterGlow.Plugs.Authorization
  plug(Authorization)
  plug(:authorize!, Question)
  plug(:scrub_params, "data" when action in [:create, :update])
  plug(:verify_authorized)

  def index(conn, %{"filter" => %{"id" => ids}}) do
    ids = ids |> String.split(",")

    if ids != [""] do
      questions =
        scope(conn, from(q in Question, where: q.id in ^ids))
        |> select([:id])
        |> Repo.all()
        |> Enum.map(fn x -> x.id end)
        |> CacheWrapper.get_by_ids(Question)
        |> Repo.preload(Question.default_preloads())

      conn
      |> render(:index, data: questions)
    else
      index(conn, nil)
    end
  end

  def index(conn, %{"q" => query, "tag" => tag_id}) do
    search_query =
      from(
        q in Question,
        where: ilike(q.title, ^"%#{query}%"),
        order_by: q.updated_at,
        limit: 10
      )

    if tag_id && tag_id != "" do
      search_query =
        search_query
        |> join(:left, [q], tq in TagQuestion, q.id == tq.question_id)
        |> where([q, tq], tq.tag_id == ^tag_id)
    end

    scope(conn, search_query)
    |> query_and_send_index_reponse(conn)
  end

  def index(conn, %{"for_variable" => "true", "query" => query}) do
    search_query =
      from(
        q in Question,
        where: fragment("cardinality(columns) = 2"),
        order_by: q.updated_at,
        limit: 10
      )

    if query && query != "" do
      search_query =
        search_query
        |> where([q], ilike(q.title, ^"%#{query}%"))
    end

    scope(conn, search_query)
    |> query_and_send_index_reponse(conn)
  end

  def index(conn, %{"database_id" => database_id, "query" => query}) do
    search_query =
      from(
        q in Question,
        where: fragment("human_sql->'database'->>'id' = ?", ^database_id),
        order_by: q.updated_at,
        limit: 10
      )

    if query && query != "" do
      search_query =
        search_query
        |> where([q], ilike(q.title, ^"%#{query}%"))
    end

    scope(conn, search_query)
    |> query_and_send_index_reponse(conn)
  end

  def index(conn, %{"id" => id, "share_id" => share_id}) when share_id != nil do
    question =
      CacheWrapper.get_by_id(id |> Integer.parse() |> elem(0), Question)
      |> Repo.preload(:tags)
      |> Repo.preload(:dashboards)
      |> Repo.preload(:variables)
      |> Repo.preload(snapshots: from(s in Snapshot, where: is_nil(s.parent_id)))
      |> Repo.preload(:widgets)

    if question.shareable_link == share_id do
      changeset =
        Question.changeset(question, %{
          shared_to:
            (question.shared_to || [])
            |> Kernel.++([conn.assigns.current_user.email])
            |> Enum.uniq()
        })

      {:ok, question} = Question.update(changeset, nil, nil)
      render(conn, :show, data: question)
    else
      send_404_response(conn)
    end
  end

  def index(conn, %{"id" => id}) do
    question =
      scope(conn, Question)
      |> select([:id])
      |> Repo.get!(id)

    question =
      CacheWrapper.get_by_id(question.id, Question)
      |> Repo.preload(:dashboards)
      |> Repo.preload(:tags)
      |> Repo.preload(:variables)
      |> Repo.preload(snapshots: from(s in Snapshot, where: is_nil(s.parent_id)))
      |> Repo.preload(:widgets)

    render(conn, :show, data: question)
  end

  def index(conn, _params) do
    scope(
      conn,
      from(
        q in Question,
        limit: 20,
        order_by: q.updated_at
      )
    )
    |> query_and_send_index_reponse(conn)
  end

  def create(conn, %{"data" => data = %{"type" => "questions", "attributes" => _question_params}}) do
    prms = Params.to_attributes(data)

    prms =
      prms
      |> Map.merge(%{"owner_id" => conn.assigns.current_user.id})

    changeset = Question.changeset(%Question{}, prms)

    case Repo.insert_with_cache(changeset) do
      {:ok, question} ->
        question =
          question
          |> Repo.preload(:dashboards)
          |> Repo.preload(:tags)
          |> Repo.preload(:variables)
          |> Repo.preload(snapshots: from(s in Snapshot, where: is_nil(s.parent_id)))
          |> Repo.preload(:widgets)

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
    question =
      scope(conn, Question)
      |> select([:id])
      |> Repo.get!(id)

    question =
      CacheWrapper.get_by_id(question.id, Question)
      |> Repo.preload(:dashboards)
      |> Repo.preload(:tags)
      |> Repo.preload(:variables)
      |> Repo.preload(snapshots: from(s in Snapshot, where: is_nil(s.parent_id)))
      |> Repo.preload(:widgets)

    render(conn, :show, data: question)
  end

  def update(conn, %{
        "id" => id,
        "data" => data = %{"type" => "questions", "attributes" => _question_params}
      }) do
    prms = Params.to_attributes(data)

    question =
      scope(conn, Question)
      |> Repo.get!(id)
      |> Repo.preload(:dashboards)
      |> Repo.preload(:tags)
      |> Repo.preload(:variables)
      |> Repo.preload(snapshots: from(s in Snapshot, where: is_nil(s.parent_id)))
      |> Repo.preload(:widgets)

    changeset = Question.changeset(question, prms)
    tag_ids = prms["tags_ids"]
    widget_ids = prms["widgets_ids"]

    widgets =
      if widget_ids |> Enum.empty?(),
        do: nil,
        else: Repo.all(from(w in Widget, where: w.id in ^widget_ids))

    tags =
      if tag_ids |> Enum.empty?(),
        do: nil,
        else: Repo.all(from(q in Tag, where: q.id in ^tag_ids))

    case Question.update(changeset, tags, widgets) do
      {:ok, question} ->
        question =
          question
          |> Repo.preload(:dashboards)
          |> Repo.preload(:tags)
          |> Repo.preload(:variables)
          |> Repo.preload(:widgets)

        render(conn, :show, data: question)

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:errors, data: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    question = scope(conn, Question) |> Repo.get!(id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete_with_cache(question)

    send_resp(conn, :no_content, "")
  end

  def results(conn, %{"id" => id, "variables" => variables}) do
    question =
      scope(conn, from(q in Question, where: q.id == ^id))
      |> Repo.one()
      |> Repo.preload(:variables)

    db_identifier = question.human_sql["database"]["unique_identifier"]
    db_record = Repo.one(from(d in Database, where: d.unique_identifier == ^db_identifier))

    params =
      permitted_params(
        question.id,
        variables,
        question.human_sql["additionalFilters"],
        question.sql
      )

    {_query, results} = run_raw_query(db_record, params, question.variables)

    case results do
      {:ok, results} ->
        conn
        |> render(QueryView, "execute.json", data: results, query: question.sql)

      {:error, error} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(QueryView, "execute.json", error: error, query: question.sql)
    end
  end

  defp query_and_send_index_reponse(query, conn) do
    questions =
      query
      |> select([:id])
      |> Repo.all()
      |> Enum.map(fn x -> x.id end)
      |> CacheWrapper.get_by_ids(Question)
      |> Repo.preload(:dashboards)
      |> Repo.preload(:tags)
      |> Repo.preload(:variables)
      |> Repo.preload(snapshots: from(s in Snapshot, where: is_nil(s.parent_id)))
      |> Repo.preload(:widgets)

    json(
      conn,
      QuestionSearchView
      |> JaSerializer.format(questions, conn, type: 'question')
    )
  end

  defp permitted_params(id, variables, additionalFilters, sql) do
    %{
      id: id,
      raw_query: sql,
      additional_filters: additionalFilters,
      variables: variables
    }
  end

  defp send_404_response(conn) do
    conn
    |> put_status(:not_found)
    |> render(:errors, data: %{error: "not-found"})
  end
end
