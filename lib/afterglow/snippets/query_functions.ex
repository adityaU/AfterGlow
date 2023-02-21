defmodule AfterGlow.Snippets.QueryFunctions do
  alias AfterGlow.Questions.QueryFunctions, as: Questions
  alias AfterGlow.Question
  @model AfterGlow.Snippets.Model
  @default_preloads []
  import Ecto.Query

  use AfterGlow.Utils.Models.Crud

  def find_by_database_id(database_id) do
    from(m in @model, where: m.database_id == ^database_id) |> Repo.all()
  end

  def find_referenced_by(snippet_id) do
    {:ok, snippet} = get(snippet_id)
    snippet_use = "{{sn:#{snippet.name}:#{snippet_id}}}"
    questions = Questions.fetch_when_sql_has(snippet_use)
    snippets = fetch_when_text_has(snippet_use)
    %{questions: questions, snippets: snippets}
  end

  defp fetch_when_text_has(text) do
    text = "%#{text}%"
    from(m in @model, where: ilike(m.text, ^text)) |> Repo.all()
  end
end
