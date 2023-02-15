defmodule AfterGlow.Visualizations.Visualizations do
  @model AfterGlow.Visualizations.Visualization
  @default_preloads []

  use AfterGlow.Utils.Models.Crud
  alias AfterGlow.CacheWrapper.Repo
  alias AfterGlow.Questions.QueryFunctions, as: Questions
  alias AfterGlow.QueryTerms.Conversions
  alias AfterGlow.Sql.QueryRunner
  alias AfterGlow.Database.QueryFunctions, as: Database

  def find_by_question_id(question_id) do
    from(m in @model, where: m.question_id == ^question_id, order_by: [asc: m.id]) |> Repo.all()
  end

  def delete_by_question_id(question_id) do
    from(m in @model, where: m.question_id == ^question_id)
    |> Repo.delete_all()
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

    {visualization, query_terms} =
      if !visualization && id do
        viz = get(id) |> elem(1)
        {viz && viz |> Map.from_struct(), viz && viz.query_terms}
      else
        {visualization, query_terms}
      end

    query_terms = Conversions.convert(query_terms)

    # cached_visualization = if 

    viz_cache_time =
      get_in(visualization, [:settings, "general", "cache_time_in_seconds"]) ||
        get_in(visualization, ["settings", "general", "cache_time_in_seconds"])

    payload = payload |> Map.delete("id")

    if payload["database"] do
      payload =
        if payload |> get_in(["version"]) == 1,
          do: payload |> Map.merge(Conversions.convert(%{"details" =>  payload})),
          else:
          payload

      fetch_results(:direct, payload, id, query_terms, viz_cache_time, current_user)
    else
      question_id = payload["question_id"] || (visualization && visualization.question_id)
      variables = payload["variables"]

      fetch_results(
        :via_question,
        question_id,
        id || visualization["id"],
        query_terms,
        variables,
        viz_cache_time,
        current_user
      )
    end
  end

  def fetch_results(:direct, payload, viz_id, query_terms, viz_cache_time, current_user) do
    {:ok, question} =
      if payload["question_id"] do
        {:ok, question} = Questions.get(payload["question_id"])
        question = question |> Map.from_struct()

        {:ok, question}
      else
        {:ok, %{}}
      end

    expire_after = viz_cache_time || get_in(question, [:config, "cache_time_in_seconds"])
    key = if payload["question_id"], do: "question##{payload["question_id"]}:#{viz_id}", else: nil

    additionalInfoKey = if key, do: key <> "#additionalInfo", else: nil

    tracking_details = %{
      question_id: payload["question_id"],
      visualization_id: viz_id,
      expire_after: expire_after,
      cache_key: key
    }

    {query, additionalInfo} =
      QueryRunner.run(payload, current_user, 5, %{
        no_tracking: true,
        cache_key: additionalInfoKey,
        expire_after: expire_after
      })

    case additionalInfo do
      {:ok, additionalInfo} ->
        payload = payload |> Map.put("additionalFilters", query_terms)
        {query, results} = QueryRunner.run(payload, current_user, nil, tracking_details)

        {results, query, additionalInfo}

      {:error, error} ->
        {{:error, error}, query, %{query_terms_applied: false}}
    end
  end

  def fetch_results(
    :via_question,
    question_id,
    viz_id,
    query_terms,
    variables,
    viz_cache_time,
    current_user
  ) do
    {:ok, question} = Questions.get(question_id)

    expire_after =
      viz_cache_time || get_in(question |> Map.from_struct(), [:config, "cache_time_in_seconds"])

    cache_key = "question##{question_id}:#{viz_id}"

    additionalInfo =
      Questions.get_results(question, variables, %{}, current_user, 5, %{
        no_tracking: true,
        cache_key: cache_key <> "#additionalInfo",
        expire_after: expire_after
      })

    case additionalInfo do
      {:ok, additionalInfo} ->
        results =
          Questions.get_results(question, variables, query_terms, current_user, nil, %{
            question_id: question_id,
            visualization_id: viz_id,
            cache_key: cache_key,
            expire_after: expire_after
          })

        {results, question.sql, additionalInfo}

      {:error, error} ->
        {{:error, error}, question.sql, %{query_terms_applied: false}}
    end
  end
end
