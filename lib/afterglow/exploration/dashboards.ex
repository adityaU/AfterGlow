defmodule AfterGlow.Explorations.Dashboards do
  import AfterGlow.Explorations
  alias AfterGlow.Question
  alias AfterGlow.Dashboard
  alias AfterGlow.Repo
  alias AfterGlow.Variable

  def create_dashboard_from_exploration(column_id, value, owner_id) do
    questions_raw_queries = dependencies_and_raw_queries(column_id, value)

    question =
      create_question(
        questions_raw_queries[:primary_question][:table],
        questions_raw_queries[:database],
        questions_raw_queries[:primary_question][:raw_query],
        owner_id
      )

    add_variable_to_question(questions_raw_queries[:column_name], "Integer", value, question)

    dependency_questions =
      questions_raw_queries[:dependencies]
      |> Enum.map(fn dep ->
        question =
          create_question(
            dep[:table],
            questions_raw_queries[:database],
            dep[:raw_query],
            owner_id
          )

        add_variable_to_question(questions_raw_queries[:column_name], "Integer", value, question)
        question
      end)

    dashboard =
      create_dashboard(
        questions_raw_queries[:primary_question][:table],
        dependency_questions ++ [question] ,
        owner_id
      )

    add_variable_to_dashboard(questions_raw_queries[:column_name], "Integer", value, dashboard)
    dashboard
  end

  def create_dashboard(title, questions, owner_id) do
    y = -12

    settings =
      questions
      |> Repo.preload(:dashboards)
      |> Enum.reduce(%{}, fn question, settings ->
        y = y + 12
        settings |> Map.put("#{question.id}", %{width: 48, height: 12, x: 0, y: y})
      end)

    changeset =
      Dashboard.changeset(%Dashboard{}, %{
        title: title,
        description: title <> "Details",
        settings: settings,
        owner_id: owner_id
      })

    dashboard =
      Repo.insert!(changeset)
      |> Repo.preload(:questions)

    changeset = Dashboard.changeset(dashboard, %{})
    {:ok, dashboard} = Dashboard.update(changeset, questions, nil)
    dashboard
  end

  def create_question(name, database, raw_query, owner_id) do
    human_sql = %{
      "views" => [],
      "filters" => [],
      "database" => %{
        "id" => database.id,
        "name" => database.name,
        "db_type" => database.db_type,
        "unique_identifier" => database.unique_identifier
      },
      "groupBys" => [],
      "orderBys" => [],
      "rawQuery" => raw_query,
      "fromTable" => true,
      "queryType" => "raw",
      "variables" => []
    }

    changeset =
      Question.changeset(%Question{}, %{
        title: name,
        results_view_settings: %{numbers: [], dataColumns: [%{}], resultsViewType: "Table"},
        human_sql: human_sql,
        query_type: "sql",
        sql: raw_query,
        owner_id: owner_id
      })

    Repo.insert!(changeset)
  end

  def add_variable_to_question(name, var_type, default, question) do
    changeset =
      Variable.changeset(%Variable{}, %{
        name: name,
        var_type: var_type,
        default: default |> to_string(),
        question_id: question.id
      })

    Repo.insert!(changeset)
  end

  def add_variable_to_dashboard(name, var_type, default, dashboard) do
    changeset =
      Variable.changeset(%Variable{}, %{
        name: name,
        var_type: var_type,
        default: default |> to_string(),
        dashboard_id: dashboard.id
      })

    Repo.insert!(changeset)
  end
end
