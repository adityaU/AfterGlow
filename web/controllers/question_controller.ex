defmodule AfterGlow.QuestionController do
  use AfterGlow.Web, :controller

  alias AfterGlow.Question
  alias AfterGlow.Database
  alias AfterGlow.Table
  alias AfterGlow.TagQuestion
  alias AfterGlow.Tag
  alias AfterGlow.Widgets.Widget
  alias AfterGlow.QueryView
  alias AfterGlow.QuestionSearchView
  alias AfterGlow.ApiActions
  alias JaSerializer.Params
  alias AfterGlow.CacheWrapper
  alias AfterGlow.CacheWrapper.Repo
  alias AfterGlow.Visualizations.Visualizations
  alias AfterGlow.QueryTerms.Conversions

  import AfterGlow.Sql.QueryRunner
  alias AfterGlow.Settings.ApplicableSettings

  alias AfterGlow.Questions.QueryFunctions, as: QuestionFunctions

  import Ecto.Query

  alias AfterGlow.Plugs.Authorization
  plug(Authorization)
  plug(:authorize!, Question)
  plug(:scrub_params, "data" when action in [:create, :update])
  plug(:verify_authorized)

  def index(conn, %{"with" => "columns"}) do
    questions =
      scope(conn, Question, policy: AfterGlow.Question.Policy)
      |> Repo.all()
      |> Enum.map(fn x -> x.id end)
      |> Repo.preload(Question.default_preloads())

    conn
    |> render(:index, data: questions)
  end

  def index(conn, %{"filter" => %{"id" => ids}}) do
    ids = ids |> String.split(",")

    if ids != [""] do
      questions =
        scope(conn, from(q in Question, where: q.id in ^ids), policy: AfterGlow.Question.Policy)
        |> Repo.all()
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

    search_query =
      if tag_id && tag_id != "" do
        search_query
        |> join(:left, [q], tq in TagQuestion, on: q.id == tq.question_id)
        |> where([q, tq], tq.tag_id == ^tag_id)
      else
        search_query
      end

    scope(conn, search_query, policy: AfterGlow.Question.Policy)
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

    scope(conn, search_query, policy: AfterGlow.Question.Policy)
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

    scope(conn, search_query, policy: AfterGlow.Question.Policy)
    |> query_and_send_index_reponse(conn)
  end

  def index(conn, %{"id" => id, "share_id" => share_id}) when share_id != nil do
    question =
      Repo.get!(Question, id |> Integer.parse() |> elem(0))
      |> Repo.preload(Question.default_preloads())

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
      |> Repo.get!(id)
      |> Repo.preload(Question.default_preloads())

    render(conn, :show, data: question)
  end

  def index(conn, _params) do
    scope(
      conn,
      from(
        q in Question,
        limit: 20,
        order_by: q.updated_at
      ),
      policy: AfterGlow.Question.Policy
    )
    |> query_and_send_index_reponse(conn)
  end

  def create(conn, %{"data" => data = %{"type" => "questions", "attributes" => _question_params}}) do
    prms = Params.to_attributes(data)

    prms =
      if prms |> get_in(["human_sql", "database", "db_type"]) == "api_client" do
        prms |> Map.merge(%{"sql" => "empty"})
      else
        prms |> Map.drop(["api_action"])
      end

    prms =
      prms
      |> Map.merge(%{"owner_id" => conn.assigns.current_user.id})

    changeset = Question.changeset(%Question{}, prms)

    case Repo.insert_with_cache(changeset) do
      {:ok, question} ->
        if prms |> get_in(["api_action"]) do
          attrs =
            prms
            |> get_in(["api_action"])
            |> Map.merge(%{"top_level_question_id" => question.id, "name" => "NA"})

          ApiActions.create_api_action(attrs)
        end

        question =
          question
          |> Repo.preload(Question.default_preloads())

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

  def show(conn, %{"id" => id, "version" => version, "share_id" => share_id}) do
    if share_id do
      question =
        Repo.get!(Question, id |> Integer.parse() |> elem(0))
        |> Repo.preload(Question.default_preloads())

      if question.shareable_link == share_id do
        changeset =
          Question.changeset(question, %{
            shared_to:
              (question.shared_to || [])
              |> Kernel.++([conn.assigns.current_user.email])
              |> Enum.uniq()
          })

        {:ok, _} = Question.update(changeset, nil, nil)
      end
    end

    question =
      scope(conn, Question)
      |> select([:id])
      |> Repo.get!(id)

    question =
      CacheWrapper.get_by_id(question.id, Question)
      |> Repo.preload(Question.default_preloads())

    question =
      if version == "1" && question.human_sql |> get_in(["version"]) != 1 do
        question
        |> Map.merge(%{human_sql: Conversions.reverse_convert(question.human_sql)})
      else
        question
      end

    render(conn, :show, data: question)
  end

  def show(conn, %{"id" => id}) do
    show(conn, %{"id" => id, "version" => 0})
  end

  def update(conn, %{
        "id" => id,
        "data" => data = %{"type" => "questions", "attributes" => _question_params}
      }) do
    prms = Params.to_attributes(data)

    prms =
      if prms |> get_in(["human_sql", "database", "db_type"]) == "api_client" do
        prms |> Map.merge(%{"sql" => "empty"})
      else
        prms |> Map.drop(["api_action"])
      end

    question =
      scope(conn, Question)
      |> Repo.get!(id)
      |> Repo.preload(Question.default_preloads())

    changeset = Question.changeset(question, prms)
    tag_ids = prms["tags_ids"] || []
    widget_ids = prms["widgets_ids"] || []

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
        if prms |> get_in(["api_action"]) do
          attrs =
            prms
            |> get_in(["api_action"])
            |> Map.merge(%{
              "top_level_question_id" => question.id,
              "name" => "NA",
              "action_level" => 2
            })

          action_id = attrs |> get_in(["id"])

          if action_id do
            api_action = ApiActions.get_api_action!(action_id)

            ApiActions.update_api_action(api_action, attrs)
          else
            ApiActions.create_api_action(attrs)
          end
        end

        question =
          question
          |> Repo.preload(Question.default_preloads())

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
    Visualizations.delete_by_question_id(id)
    Repo.delete_with_cache(question)

    send_resp(conn, :no_content, "")
  end

  def results(conn, %{
        "id" => id,
        "variables" => variables,
        "additionalFilters" => additional_filters
      }) do
    question =
      scope(conn, from(q in Question, where: q.id == ^id), policy: AfterGlow.Question.Policy)
      |> Repo.one()

    results =
      QuestionFunctions.get_results(
        question,
        variables,
        additional_filters,
        conn.assigns.current_user
      )

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

  def get_query(conn, params) do
    query =
      if params["queryType"] == "raw" do
        params["rawQuery"]
      else
        make_question_query(params)
      end

    conn |> json(%{query: query})
  end

  defp query_and_send_index_reponse(query, conn) do
    questions =
      query
      |> select([:id])
      |> Repo.all()
      |> Enum.map(fn x -> x.id end)
      |> CacheWrapper.get_by_ids(Question)
      |> Repo.preload(Question.default_preloads())

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
      variables: variables |> Enum.filter(fn x -> x |> Map.has_key?("name") end)
    }
  end

  defp send_404_response(conn) do
    conn
    |> put_status(:not_found)
    |> render(:errors, data: %{error: "not-found"})
  end
end
