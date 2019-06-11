defmodule AfterGlow.Sql.QueryRunner do
  alias AfterGlow.Question
  alias AfterGlow.Sql.DbConnection
  alias AfterGlow.Async
  alias AfterGlow.ColumnValuesTasks
  alias AfterGlow.Repo
  alias AfterGlow.Database
  alias AfterGlow.Table
  import Ecto.Query, only: [from: 2]

  def make_final_query(db_record, params, question_variables) do
    query = Question.replace_variables(params[:raw_query], question_variables, params[:variables])

    variables_replaced_query = if params[:raw_query] != query, do: true, else: false
    params = %{params | raw_query: query}

    query =
      DbConnection.query_string(db_record |> Map.from_struct(), params |> additional_query_obj)

    {variables_replaced_query, query}
  end

  def run_raw_query(db_record, params), do: run_raw_query(db_record, params, params[:variables])

  def run_raw_query(db_record, params, question_variables) do
    {variables_replaced_query, query} = make_final_query(db_record, params, question_variables)
    results = DbConnection.execute(db_record |> Map.from_struct(), query)

    results =
      results
      |> Question.insert_variables_replaced_at_query(variables_replaced_query)
      |> Question.insert_additional_filters_applied(
        additional_filters_exists?(params[:additional_filters])
      )
      |> Question.insert_final_query(query)

    cache_results(params, results, params[:raw_query])
    {params[:raw_query], results}
  end

  def run_query_from_object(db_record, params) do
    permit_prms = permit_params(params)
    query = DbConnection.query_string(db_record |> Map.from_struct(), permit_prms)

    permit_prms = permit_prms_raw_query(permit_prms, query)

    {query, results} = run_raw_query(db_record, permit_prms)

    results =
      unless params["table"]["sql"] do
        results |> Table.insert_foreign_key_columns_in_results(permit_prms[:table])
      else
        results
      end

    save_column_values(results, permit_prms)
    {query, results}
  end

  def permit_prms_raw_query(params, query) do
    params
    |> Map.merge(%{
      :raw_query => query
    })
  end

  defp make_final_query_for_question(question_id) do
    question =
      from(q in Question, where: q.id == ^question_id)
      |> Repo.one()
      |> Repo.preload(:variables)

    db_identifier = question.human_sql["database"]["unique_identifier"]
    db_record = Repo.one(from(d in Database, where: d.unique_identifier == ^db_identifier))

    params =
      permitted_params(
        question.id,
        question.variables,
        question.human_sql["additionalFilters"],
        question.sql
      )

    make_final_query(db_record, params, question.variables)
  end

  defp permitted_params(id, variables, additionalFilters, sql) do
    %{
      id: id,
      raw_query: sql,
      additional_filters: additionalFilters,
      variables: variables
    }
  end

  def permit_params(params) do
    table =
      if params["table"]["sql"] do
        {_, sql} = make_final_query_for_question(params["table"]["id"])
        %{"name" => sql}
      else
        params["table"]
      end

    %{
      id: params["id"],
      database: params["database"],
      table: table,
      selects: params["views"] && params["views"] |> Enum.map(fn x -> x["selected"] end),
      group_bys:
        params["groupBys"] &&
          params["groupBys"] |> Enum.map(fn x -> [x["selected"], x["castType"]["value"]] end),
      filters: params["filters"],
      order_bys: params["orderBys"],
      limit: params["limit"],
      offset: params["offset"],
      additional_filters: params["additionalFilters"],
      variables: params["variables"]
    }
  end

  def cache_results(params, results, current_sql) do
    case results do
      {:ok, results} ->
        if params[:id] do
          question = Question |> Repo.get!(params[:id]) |> Repo.preload(:variables)

          if !non_default_additional_filters_exists?(params[:additional_filters], question) &&
               current_sql == question.sql do
            Async.perform(&Question.cache_results/3, [question, params[:variables], results])
          end
        end

      _ ->
        "pass"
    end
  end

  defp non_default_additional_filters_exists?(additional_filters, question) do
    additional_filters != question.human_sql["additionalFilters"]
  end

  defp additional_filters_exists?(nil), do: false

  defp additional_filters_exists?(params) do
    (params["filters"] && !(params["filters"] |> Enum.empty?())) ||
      (params["groupBys"] && !(params["groupBys"] |> Enum.empty?())) ||
      (params["orderBys"] && !(params["orderBys"] |> Enum.empty?()))
  end

  defp additional_query_obj(params) do
    prms = permit_params(params[:additional_filters])

    prms =
      prms
      |> Map.merge(%{
        database: params[:database],
        table: %{"name" => params[:raw_query]}
      })

    prms
  end

  defp save_column_values(results, permit_prms) do
    case results do
      {:ok, valid_results} ->
        Async.perform(&ColumnValuesTasks.save/2, [permit_prms[:table]["id"], valid_results])

      _ ->
        "pass"
    end
  end
end
