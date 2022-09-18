defmodule AfterGlow.Visualizations.Visualizations do
  @model AfterGlow.Visualizations.Visualization
  @default_preloads []

  use AfterGlow.Utils.Models.Crud
  alias AfterGlow.CacheWrapper.Repo
  alias AfterGlow.Questions.QueryFunctions, as: Questions
  alias AfterGlow.QueryTerms.Conversions
  alias AfterGlow.Sql.QueryRunner

  def find_by_question_id(question_id) do
    from(m in @model, where: m.question_id == ^question_id, order_by: [asc: m.id]) |> Repo.all()
  end

  def save(visualizations, question_id) do
    visualizations =
      visualizations
      |> Enum.map(fn viz ->
        for {key, val} <- viz, into: %{} do
          {Inflex.underscore(key), val}
        end
        |> Map.merge(%{"question_id" => question_id})
      end)

    visualizations
    |> Enum.each(fn viz ->
      if viz["id"] do
        update(viz["id"], viz)
      else
        create(viz)
      end
    end)

    find_by_question_id(question_id)
  end

  def results(id, rest, current_user) do
    visualization = get_in(rest, ["visualization"])
    query_terms = get_in(visualization, ["queryTerms"]) || get_in(visualization, ["query_terms"])
    payload = rest |> Map.delete("visualization")

    query_terms = Conversions.convert(query_terms)
    question_id = payload["question_id"]

    payload = payload |> Map.delete("id")

    if payload["database"] do
      fetch_results(:direct, payload, id, query_terms, current_user)
    else
      variables = payload["variables"]

      fetch_results(
        :via_question,
        question_id,
        id || visualization["id"],
        query_terms,
        variables,
        current_user
      )
    end
  end

  def fetch_results(:direct, payload, viz_id, query_terms, current_user) do
    {query, additionalInfo} = QueryRunner.run(payload, current_user, 5, %{no_tracking: true})

    case additionalInfo do
      {:ok, additionalInfo} ->
        payload = payload |> Map.put("additionalFilters", query_terms)

        {query, results} =
          QueryRunner.run(payload, current_user, nil, %{
            question_id: payload["question_id"],
            visualization_id: viz_id
          })

        {results, query, additionalInfo}

      {:error, error} ->
        {{:error, error}, query, %{query_terms_applied: false}}
    end
  end

  def fetch_results(:via_question, question_id, viz_id, query_terms, variables, current_user) do
    {:ok, question} = Questions.get(question_id)

    additionalInfo =
      Questions.get_results(question, variables, %{}, current_user, 5, %{no_tracking: true})

    case additionalInfo do
      {:ok, additionalInfo} ->
        results =
          Questions.get_results(question, variables, query_terms, current_user, nil, %{
            question_id: question_id,
            visualization_id: viz_id
          })

        {results, question.sql, additionalInfo}

      {:error, error} ->
        {{:error, error}, question.sql,  %{query_terms_applied: false}}
    end
  end
end
