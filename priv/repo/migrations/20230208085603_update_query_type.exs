defmodule AfterGlow.Repo.Migrations.UpdateQueryType do
  use Ecto.Migration

  alias AfterGlow.Questions.QueryFunctions, as: Questions
  alias AfterGlow.QueryTerms.Conversions

  def up do
    {:ok, questions} = Questions.list()
    questions |> Enum.each(fn q -> 
      human_sql = if q.query_type === 'sql' do
        q.human_sql |> Map.merge(%{"queryType": "raw" })
      else
        q.human_sql |> Map.merge(%{"queryType": "query_builder" })
      end
      Questions.update(q, %{human_sql: human_sql})
    end)

  end

  def down do
    
  end
end
