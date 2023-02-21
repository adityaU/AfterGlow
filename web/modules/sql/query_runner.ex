defmodule AfterGlow.Sql.QueryRunner do
  alias AfterGlow.Question
  alias AfterGlow.Sql.DbConnection
  alias AfterGlow.Async
  alias AfterGlow.ColumnValuesTasks
  alias AfterGlow.Repo
  alias AfterGlow.Database
  alias AfterGlow.Table
  alias AfterGlow.Column
  alias AfterGlow.Settings.ApplicableSettings
  alias AfterGlow.Questions.QueryFunctions, as: Questions
  alias AfterGlow.Snippets.QueryFunctions, as: Snippets

  alias AfterGlow.ResultsCache.QueryFunctions, as: ResultsCache

  alias AfterGlow.AuditLogs.AuditLogs
  import Ecto.Query, only: [from: 2]
  import IEx.Info, only: [info: 1]

  alias AfterGlow.Utils.Map, as: UtilsMap

  def run(params, current_user) do
    run(params, current_user, nil, %{})
  end

  def expand_query(query) do
    expanded_query =
      replace_snippets(query)
      |> replace_question_variable_sql()

    if query == expanded_query do
      expanded_query
    else
      expand_query(expanded_query)
    end
  end

  def replace_snippets(query) do
    matches = Regex.scan(~r/{{ *sn:.+:(\d+) *}}/, query)

    case matches do
      [] ->
        query

      _ ->
        matches
        |> Enum.reduce(query, fn m, acc ->
          snippet_id = m |> Enum.at(1)
          {:ok, snippet} = Snippets.get(snippet_id)

          acc =
            case snippet do
              nil ->
                acc
                |> String.replace(m |> Enum.at(0), "No snippet With ID #{m |> Enum.at(1)} ")

              _ ->
                acc |> String.replace(m |> Enum.at(0), "#{snippet.text}")
            end

          replace_snippets(acc)
        end)
    end
  end

  def replace_question_variable_sql(query) do
    matches = Regex.scan(~r/{{ *ques:(\d+) *}}/, query)

    case matches do
      [] ->
        query

      _ ->
        matches
        |> Enum.reduce(query, fn m, acc ->
          question_id = m |> Enum.at(1)
          {:ok, ques} = Questions.get(question_id)

          acc =
            case ques do
              nil ->
                acc
                |> String.replace(m |> Enum.at(0), "(No Question With ID #{m |> Enum.at(1)} )")

              _ ->
                acc |> String.replace(m |> Enum.at(0), "(#{ques.sql})")
            end

          replace_question_variable_sql(acc)
        end)
    end
  end

  def make_question_query(params) do
    db_identifier = params["database"]["unique_identifier"]
    db_record = Repo.one(from(d in Database, where: d.unique_identifier == ^db_identifier))
    permit_prms = permit_params(params)
    DbConnection.query_string(db_record |> Map.from_struct(), permit_prms)
  end

  def run(params, current_user, limit, tracking_details) do
    db_identifier = params["database"]["unique_identifier"]
    db_record = Repo.one(from(d in Database, where: d.unique_identifier == ^db_identifier))
    limit = if limit, do: limit, else: ApplicableSettings.max_frontend_limit(current_user)

    tracking_details = %{current_user: current_user} |> Map.merge(tracking_details)

    {query, results} =
      case params["queryType"] do
        "query_builder" ->
          run_query_from_object(
            db_record,
            params,
            limit,
            tracking_details
          )

        _ ->
          permit_prms =
            params
            |> permit_params
            |> permit_prms_raw_query(params["rawQuery"])

          run_raw_query(db_record, permit_prms, limit, tracking_details)
      end

    {query, results}
  end

  def make_final_query(db_record, params, question_variables) do
    query =
      expand_query(params[:raw_query])
      |> Question.replace_variables(question_variables, params[:variables])

    variables_replaced_query = if params[:raw_query] != query, do: true, else: false
    params = %{params | raw_query: query}

    query =
      DbConnection.query_string(db_record |> Map.from_struct(), params |> additional_query_obj)

    {variables_replaced_query, query}
  end

  def run_raw_query(db_record, params, frontend_limit, tracking_details),
    do: run_raw_query(db_record, params, params[:variables], frontend_limit, tracking_details)

  def run_raw_query(db_record, params, question_variables, frontend_limit, tracking_details) do
    {variables_replaced_query, query} = make_final_query(db_record, params, question_variables)

    {time, updated_at, cached_until, from_cache, results} =
      if tracking_details && tracking_details[:expire_after] && tracking_details[:cache_key] &&
           tracking_details[:expire_after] != 0 do
        {updated_at, cached_until, results} =
          ResultsCache.get_by(tracking_details[:cache_key], query)

        if results do
          {0, updated_at, cached_until, true, {:ok, results}}
        else
          {time, results} =
            :timer.tc(&DbConnection.execute/3, [
              db_record |> Map.from_struct(),
              query,
              frontend_limit
            ])

          case results do
            {:ok, results} ->
              ResultsCache.set_async(
                tracking_details[:cache_key],
                query,
                tracking_details[:expire_after],
                results
              )

            _ ->
              :pass
          end

          {time, nil, nil, false, results}
        end
      else
        {time, results} =
          :timer.tc(&DbConnection.execute/3, [
            db_record |> Map.from_struct(),
            query,
            frontend_limit
          ])

        {time, nil, nil, false, results}
      end

    results =
      results
      |> Question.insert_variables_replaced_at_query(variables_replaced_query)
      |> Question.insert_additional_filters_applied(
        additional_filters_exists?(params[:additional_filters])
      )
      |> Question.insert_final_query(query)
      |> insert_inferred_column_details()
      |> set_from_cache(from_cache, updated_at, cached_until)

    cache_results(params, results, params[:raw_query])

    number_of_rows =
      if results |> elem(1) |> Map.get(:rows) do
        results |> elem(1) |> Map.get(:rows) |> length
      else
        0
      end

    queryError =
      if results |> elem(1) |> Map.get(:message) do
        results |> elem(1) |> Map.get(:message)
      else
        nil
      end

    if tracking_details && tracking_details[:current_user] && !tracking_details[:no_tracking] do
      AuditLogs.create_audit_log(%{
        whodunit: tracking_details[:current_user].id,
        additional_data:
          %{database: db_record.id, sql: query}
          |> Map.merge(
            tracking_details
            |> Map.merge(%{query_time: time})
            |> Map.merge(%{fetched_rows: number_of_rows})
            |> Map.merge(%{error: queryError})
            |> Map.merge(%{from_cache: from_cache})
            |> Map.delete(:current_user)
            |> Map.delete(:database)
          ),
        action: 1
      })
    end

    {params[:raw_query], results}
  end

  defp set_from_cache(results, from_cache, updated_at, cached_until) do
    resMap = results |> elem(1)

    results
    |> Tuple.insert_at(
      1,
      resMap
      |> Map.put(:from_cache, from_cache)
      |> Map.put(:cache_updated_at, updated_at)
      |> Map.put(:cached_until, cached_until)
    )
    |> Tuple.delete_at(2)
  end

  def insert_inferred_column_details(results) do
    resMap = results |> elem(1)
    rows = resMap |> UtilsMap.get(:rows)

    if rows && rows |> length >= 1 do
      results
      |> Tuple.insert_at(
        1,
        resMap
        |> Map.put(
          :column_details,
          resMap
          |> UtilsMap.get(:columns)
          |> Enum.with_index()
          |> Enum.reduce(%{}, fn {col, index}, det ->
            det
            |> Map.put(col, %{data_type: infer_data_type(rows, index, 0, [], false)})
          end)
        )
      )
      |> Tuple.delete_at(2)
    else
      results
      |> Tuple.insert_at(
        1,
        resMap
        |> Map.put(
          :column_details,
          %{}
        )
      )
      |> Tuple.delete_at(2)
    end
  end

  defp infer_data_type(rows, colIndex, rowIndex, possible_data_types, max_index_reached) do
    if possible_data_types |> length == 5 || max_index_reached do
      if possible_data_types |> Enum.uniq() |> length == 1 do
        possible_data_types |> Enum.at(0)
      else
        "String"
      end
    else
      possible_data_types =
        if entry = rows |> Enum.at(rowIndex) |> Enum.at(colIndex) do
          possible_data_types ++
            [infer_dt(info(entry) |> Enum.into(%{}) |> Map.get("Data type"), entry)]
        else
          possible_data_types
        end

      rowIndex = rowIndex + 1
      max_index_reached = rowIndex == rows |> length
      infer_data_type(rows, colIndex, rowIndex, possible_data_types, max_index_reached)
    end
  end

  def infer_dt("string", value), do: infer_dt("BitString", value)

  def infer_dt("BitString", value) do
    cond do
      parse_datetime(value) -> "Inferred.DateTime"
      parse_email(value) -> "Inferred.Email"
      parse_url(value) -> "Inferred.Url"
      true -> "string"
    end
  end

  def infer_dt("Atom", value) do
    if value == true || value == false do
      "Boolean"
    else
      "string"
    end
  end

  def infer_dt(datatype, _) do
    datatype
  end

  def parse_email(value) do
    r = ~R<^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$>
    Regex.match?(r, value)
  end

  def parse_datetime(value) do
    cond do
      DateTime.from_iso8601(value) |> elem(0) == :ok -> true
      DateTime.from_iso8601(value <> "Z") |> elem(0) == :ok -> true
      Timex.parse(value, "{YYYY}-{0M}-{D}") |> elem(0) == :ok -> true
      true -> false
    end
  end

  def parse_url(value) do
    uri = URI.parse(value)
    uri.scheme != nil && uri.host != nil
  end

  def run_query_from_object(db_record, params, frontend_limit, tracking_details) do
    permit_prms = permit_params(params)

    query = DbConnection.query_string(db_record |> Map.from_struct(), permit_prms)

    permit_prms = permit_prms_raw_query(permit_prms, query)

    tracking_details = (tracking_details || %{}) |> Map.merge(permit_prms)

    {query, results} = run_raw_query(db_record, permit_prms, frontend_limit, tracking_details)

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
    table_record =
      if table_id = params["table"] && params["table"]["id"] do
        Table |> Repo.get(table_id)
      else
        nil
      end

    table =
      if params["table"]["sql"] do
        {_, sql} = make_final_query_for_question(params["table"]["id"])
        %{"name" => sql}
      else
        params["table"]
      end

    schema =
      unless table["id"] do
        %{}
      else
        make_schema(table["id"])
      end

    %{
      id: params["id"],
      database: params["database"],
      table: table,
      selects:
        params["views"] &&
          params["views"]
          |> Enum.map(fn x -> view_maker(x["selected"], table_record) end)
          |> List.flatten(),
      group_bys:
        params["groupBys"] &&
          params["groupBys"] |> Enum.map(fn x -> [x["selected"], x["castType"]["value"]] end),
      filters: params["filters"],
      order_bys: params["orderBys"],
      limit: params["limit"],
      offset: params["offset"],
      additional_filters: params["additionalFilters"],
      variables: params["variables"] || %{},
      schema: schema
    }
  end

  defp view_maker(view, nil), do: view

  defp view_maker(%{"raw" => true, "value" => "*"}, table) do
    star_view(table)
  end

  defp view_maker(%{"name" => _name, "value" => "raw_data"}, table) do
    star_view(table)
  end

  defp star_view(table) do
    table
    |> Table.preload_columns()
    |> Map.get(:columns)
    |> Enum.map(fn x ->
      %{"raw" => true, "value" => x.name}
    end)
  end

  defp view_maker(view, _table), do: view

  defp make_schema(table_id) do
    Table.make_schema(table_id)
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
