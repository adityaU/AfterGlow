defmodule AfterGlow.Questions.DataFetcher do
  alias AfterGlow.Question
  alias AfterGlow.Database
  alias AfterGlow.Sql.DbConnection
  alias AfterGlow.Repo
  import Ecto.Query

  def fetch_via_stream_with_default_variables(question, function_on_stream, snapshot \\ nil) do
    question = question |> Repo.preload(:variables)
    db_identifier = question.human_sql["database"]["unique_identifier"]
    db_record = Repo.one(from(d in Database, where: d.unique_identifier == ^db_identifier))

    query =
      Question.replace_variables(question.sql, question.variables, question.variables, snapshot)

    DbConnection.execute_with_stream(
      db_record |> Map.from_struct(),
      query,
      function_on_stream
    )
  end
end
