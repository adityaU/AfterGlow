defmodule AfterGlow.AutoComplete do
  import Ecto.Query, warn: false
  alias AfterGlow.Table
  alias AfterGlow.Column
  alias AfterGlow.Repo
  alias AfterGlow.Autocomplete.SearchItem
  alias AfterGlow.Question
  alias AfterGlow.Dashboard
  alias AfterGlow.Tag
  alias AfterGlow.Question.Policy, as: QuestionPolicy
  alias AfterGlow.Dashboard.Policy, as: DashboardPolicy

  def entity_autocomplete("", current_user) do
    question_query(current_user)
    |> Repo.all()
    |> Enum.map(fn question ->
      %SearchItem{title: question.title, item_type: "question", type_id: question.id}
    end)
    |> Kernel.++(
      dashboard_query(current_user)
      |> Repo.all()
      |> Enum.map(fn dashboard ->
        %SearchItem{title: dashboard.title, item_type: "dashboard", type_id: dashboard.id}
      end)
    )
    |> Kernel.++(
      tag_query(current_user)
      |> Repo.all()
      |> Enum.map(fn tag ->
        %SearchItem{title: tag.name, item_type: "tag", type_id: tag.id}
      end)
    )
    |> set_ids()
  end

  def entity_autocomplete(query, current_user) do
    question_query(current_user)
    |> where([q], ilike(q.title, ^"%#{query}%"))
    |> Repo.all()
    |> Enum.map(fn question ->
      %SearchItem{title: question.title, item_type: "question", type_id: question.id}
    end)
    |> Kernel.++(
      dashboard_query(current_user)
      |> where([d], ilike(d.title, ^"%#{query}%"))
      |> Repo.all()
      |> Enum.map(fn dashboard ->
        %SearchItem{title: dashboard.title, item_type: "dashboard", type_id: dashboard.id}
      end)
    )
    |> Kernel.++(
      tag_query(current_user)
      |> where([t], ilike(t.name, ^"%#{query}%"))
      |> Repo.all()
      |> Enum.map(fn tag ->
        %SearchItem{title: tag.name, item_type: "tag", type_id: tag.id}
      end)
    )
    |> set_ids
  end

  defp set_ids(arr) do
    arr
    |> Enum.with_index()
    |> Enum.map(fn {item, index} ->
      item |> Map.put(:id, index + 1)
    end)
  end

  defp question_query(current_user) do
    from(q in QuestionPolicy.scope(current_user, :index, Question),
      limit: 5
    )
  end

  defp dashboard_query(current_user) do
    from(q in DashboardPolicy.scope(current_user, :index, Dashboard),
      limit: 5
    )
  end

  defp tag_query(_current_user) do
    from(q in Tag,
      limit: 5
    )
  end

  def autocomplete(database_id, prefix) do
    tables =
      from(
        t in Table,
        where: ilike(t.name, ^"%#{prefix}%") and t.database_id == ^database_id,
        limit: 5
      )
      |> Repo.all()
      |> Enum.map(fn t ->
        %{
          name: t.readable_table_name,
          value: t.readable_table_name,
          meta: "table",
          score: 1000 / (t.name |> String.length())
        }
      end)

    columns =
      from(
        c in Column,
        where: ilike(c.name, ^"%#{prefix}%"),
        left_join: t in Table,
        on: [id: c.table_id],
        where: t.database_id == ^database_id,
        limit: 5
      )
      |> Repo.all()
      |> Repo.preload(:table)
      |> Enum.map(fn c ->
        %{
          name: "#{c.table.readable_table_name}.#{c.name}",
          value: "#{c.table.readable_table_name}.#{c.name}",
          meta: "column",
          score: 1000 / (c.name |> String.length())
        }
      end)

    tables ++ columns
  end
end
