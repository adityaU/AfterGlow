require IEx
defmodule AfterGlow.QuestionController do
  use AfterGlow.Web, :controller

  alias AfterGlow.Question
  alias AfterGlow.Database
  alias AfterGlow.Tag
  alias AfterGlow.Variable
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
    questions = scope(conn, (from q in Question, where: q.id in ^ids)) |> Repo.all() |> Repo.preload(:dashboards) |> Repo.preload(:tags) |> Repo.preload(:variables)
    render(conn, :index, data: questions)
  end
  def index(conn, _params) do
    questions = scope(conn, Question) |> Repo.all()|> Repo.preload(:dashboards) |> Repo.preload(:tags) |> Repo.preload(:variables) 
    render(conn, :index, data: questions)
  end

  def create(conn, %{"data" => data = %{"type" => "questions", "attributes" => _question_params}}) do
    prms = Params.to_attributes(data)
    prms = prms |> Map.merge(%{"owner_id" => conn.assigns.current_user.id})
    changeset = Question.changeset(%Question{}, prms)

    case Repo.insert(changeset) do
      {:ok, question} ->
        question = question |> Repo.preload(:dashboards) |> Repo.preload(:tags) |> Repo.preload(:variables)
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
    question = scope(conn, Question) |>  Repo.get!(id) |> Repo.preload(:dashboards) |> Repo.preload(:tags)|> Repo.preload(:variables)
    render(conn, :show, data: question)
  end

  def update(conn, %{"id" => id, "data" => data = %{"type" => "questions", "attributes" => _question_params}}) do
    prms = Params.to_attributes(data)
    question =  scope(conn, Question) |> Repo.get!(id)|> Repo.preload(:tags) |> Repo.preload(:variables)
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
    Repo.delete!(question)

    send_resp(conn, :no_content, "")
  end

  def results(conn, %{"id" => id, "variables" => variables}) do
    question =  scope(conn, (from q in Question, where: q.id == ^id)) |> Repo.one() |> Repo.preload(:variables)
    db_identifier = question.human_sql["database"]["unique_identifier"]
    db_record = Repo.one(from d in Database, where: d.unique_identifier == ^db_identifier) 
    query = replace_variables(question.sql, question.variables , variables)
    results = DbConnection.execute(db_record |> Map.from_struct, query )

    case results do
      {:ok, results} ->
        cached_results = if used_non_default_variables?(question.variables, variables), do: nil, else: results
        if cached_results do
          question |> Question.update_columns(cached_results.columns, cached_results)
        end
        conn
        |> render QueryView, "execute.json", data: results, query: question.sql
      {:error, error} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render QueryView, "execute.json", error: error, query: question.sql
    end
  end
  def used_non_default_variables?(default_variables, query_variables) do
    case default_variables |> length == 0 do
      true ->
        false
      false->
        default_variables
        |> Enum.map(fn var->
          q_var = query_variables |> Enum.filter(fn x -> x["name"] == var.name end) |> Enum.at(0)
          if q_var && q_var["value"], do: q_var["value"] != var.default, else: false
        end)
        |> Enum.any?(fn x -> x end)
    end
  end

  defp replace_variables(query, default_variables, query_variables) do
    variables = default_variables
    |> Enum.map(fn var->
      q_var = query_variables |> Enum.filter(fn x -> x["name"] == var.name end) |> Enum.at(0)
      value = if q_var && q_var["value"], do: q_var["value"], else: var.default
      value = Variable.format_value(var, value)
      %{
        name: var.name,
        value: value 
      }
    end)
    variables
    |> Enum.reduce(query, fn variable, query ->
      variable_name = variable[:name] |> String.strip()
      query
      |> String.replace(~r({{.*#{variable_name}.*}}), variable[:value] || "")
    end)
  end

end
