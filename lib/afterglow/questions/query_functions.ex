defmodule AfterGlow.Questions.QueryFunctions do
  @model AfterGlow.Question
  @default_preloads []

  use AfterGlow.Utils.Models.Crud
  alias AfterGlow.CacheWrapper.Repo
  alias AfterGlow.Settings.ApplicableSettings
  alias AfterGlow.Database
  alias AfterGlow.Table

  import AfterGlow.Sql.QueryRunner

  def get_results(question, variables, additional_filters, current_user) do
    get_results(question, variables, additional_filters, current_user, nil, %{})
  end

  def get_results(question, variables, additional_filters, current_user, limit, tracking_details) do
    question =
      question
      |> Repo.preload(:variables)
      |> Repo.preload(:api_action)

    results =
      if question.query_type == :api_client do
        results =
          ApiActions.send_request(
            question.api_action,
            variables,
            question.api_action.open_in_new_tab,
            current_user
          )

        Question.cache_results(question, variables, results)
        {:ok, results}
      else
        frontend_limit = limit || ApplicableSettings.max_frontend_limit(current_user)
        db_identifier = question.human_sql["database"]["unique_identifier"]
        db_record = Repo.one(from(d in Database, where: d.unique_identifier == ^db_identifier))



       # human_sql =  if question.human_sql |> get_in(["version"]) == 1,
       #    do: question.human_sql |> Map.merge(Conversions.convert(%{"details" =>  payload})),
       #    else:
       #    question.human_sql
       #  end

        params =
          permitted_params(
            question.id,
            variables,
            additional_filters || question.human_sql["additionalFilters"],
            question.sql
          )

        tracking_details =
          %{
            current_user: current_user,
            question_id: question.id
          }
          |> Map.merge(tracking_details)

        {_query, results} =
          run_raw_query(db_record, params, question.variables, frontend_limit, tracking_details)

        if question.human_sql && question.human_sql["queryType"] == "query_builder" &&
             question.human_sql["table"] && !question.human_sql["table"]["sql"] do
          results |> Table.insert_foreign_key_columns_in_results(question.human_sql["table"])
        else
          results
        end
      end
  end

  defp permitted_params(id, variables, additionalFilters, sql) do
    %{
      id: id,
      raw_query: sql,
      additional_filters: additionalFilters,
      variables:
        (variables && variables |> Enum.filter(fn x -> x |> Map.has_key?("name") end)) || []
    }
  end
end
