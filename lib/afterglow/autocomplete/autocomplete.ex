defmodule AfterGlow.AutoComplete do
  import Ecto.Query, warn: false
  import AfterGlow.Sql.QueryRunner, only: [run_query_from_object: 4]
  alias AfterGlow.Database
  alias AfterGlow.Table
  alias AfterGlow.Column
  alias AfterGlow.Repo
  alias AfterGlow.Autocomplete.SearchItem
  alias AfterGlow.Question
  alias AfterGlow.Dashboard
  alias AfterGlow.Tag
  alias AfterGlow.User
  alias AfterGlow.Teams.Team
  alias AfterGlow.Question.Policy, as: QuestionPolicy
  alias AfterGlow.Dashboard.Policy, as: DashboardPolicy

  @snippets [
    if: "<%= if var do %>\n\tand col =  <%= var %>\n<% end %>",
    ifel: "<%= if var do %>\n\tand col =  <%= var %>\n<% else %>\n\tdefault_condition\n<% end %>"
  ]

  def column_suggestions_autocomplete(query, database_id, table_id, column_id) do
    database = Repo.get(Database, database_id)
    table = Repo.get(Table, table_id)
    column = Repo.get(Column, column_id)

    params = %{
      "table" => %{"name" => table.name, "id" => table.id},
      "views" => [%{"selected" => %{"raw" => true, "value" => column.name}}],
      "filters" => [
        %{
          "column" => %{"name" => column.name},
          "operator" => %{"name" => "matches", "value" => "matches"},
          "value" => query,
          "valueDateObj" => %{"date" => false}
        }
      ],
      "order_by" => [
        %{
          "column" => %{"name" => column.name},
          "order" => %{"name" => "ascending", "value" => "ASC"},
          "selected" => %{"raw" => false, "value" => nil}
        }
      ]
    }

    {_, {:ok, results}} = run_query_from_object(database, params, 10, nil)

    results[:rows]
    |> Enum.map(fn x -> %{displayName: x |> Enum.at(0)} end)
  end

  def table_autocomplete("", database_id, _only_tables) do
    from(t in Table,
      where: t.database_id == ^database_id,
      order_by: [fragment("? ASC, length(?) ASC", t.readable_table_name, t.readable_table_name)],
      limit: 200
    )
    |> Repo.all()
    |> Repo.preload(columns: {from(c in Column, limit: 0), :belongs_to})
  end

  def table_autocomplete(q, database_id, only_tables) do
    tables =
      from(t in Table,
        where:
          ilike(t.readable_table_name, ^"%#{q |> String.split() |> Enum.join("%")}%") and
            t.database_id == ^database_id,
        order_by: [fragment("? ASC, length(?) ASC", t.readable_table_name, t.readable_table_name)],
        limit: 20
      )
      |> Repo.all()
      |> Repo.preload(columns: {from(c in Column, limit: 0), :belongs_to})

    table_with_columns =
      if !only_tables || only_tables != "true" do
        from(t in Table,
          left_join: c in Column,
          on: c.table_id == t.id,
          where:
            ilike(c.name, ^"%#{q |> String.split() |> Enum.join("%")}%") and
              t.database_id == ^database_id,
          order_by: [
            fragment("? ASC, length(?) ASC", t.readable_table_name, t.readable_table_name)
          ],
          group_by: t.id,
          limit: 20
        )
        |> Repo.all()
        |> Repo.preload(
          columns: {from(c in Column, where: ilike(c.name, ^"%#{q}%")), :belongs_to}
        )
        |> Enum.map(fn t -> %{t | open: true, expandable: true} end)
      else
        []
      end

    tables =
      tables
      |> Enum.reject(fn table ->
        table_with_columns
        |> Enum.any?(fn t ->
          t.readable_table_name == table.readable_table_name
        end)
      end)
      |> Enum.map(fn t -> %{t | open: false, expandable: false} end)

    (tables ++ table_with_columns)
    |> Enum.sort(&(&1.readable_table_name < &2.readable_table_name))
  end

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

  def get_recipients(query) do
    from(u in User)
    |> where([q], ilike(q.email, ^"%#{query}%"))
    |> Repo.all()
    |> Enum.map(fn u -> u.email end)
    |> Kernel.++(
      from(u in Team)
      |> where([q], ilike(q.name, ^"%#{query}%"))
      |> Repo.all()
      |> Enum.map(fn t -> ~s/"#{t.name}"/ <> "@team" end)
    )
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

  def table_regex do
    ~r/(?<matched>(from|join)\s+(?<table>\S+)\W*((as){0,1}\W*)(?<alias>(?!(left|right|outer|inner|join|where|group|having|window|union|all|except|distinct|order|limit|offset|fetch|for|with|roleup|grouping|intersect|cube))\S+){0,1})/i
  end

  def table_regex_with_ending do
    ~r/(?<matched>(from|join)\s+(?<table>\S+)\W*((as){0,1}\W*)(?<alias>(?!(left|right|outer|inner|join|where|group|having|window|union|all|except|distinct|order|limit|offset|fetch|for|with|roleup|grouping|intersect|cube))\S+){0,1})$/i
  end

  def find_tables(query, start \\ []) do
    regex = table_regex()

    found = Regex.named_captures(regex, query)

    new =
      if found && found["matched"] do
        found = if found["alias"] == "", do: found |> Map.put("alias", nil), else: found
        start = start ++ [found]
        query = query |> String.replace(found["matched"], "")

        find_tables(query, start)
      else
        start
      end

    new
  end

  defp ending_with_alias(query, tables, prefix) do
    tables
    |> Enum.filter(fn x ->
      Regex.match?(~r/(#{x["alias"]}|#{x["table"]})(\.){0,1}(#{prefix}){0,1}$/, query) ||
        Regex.match?(~r/^#{prefix}/, x["alias"]) ||
        Regex.match?(~r/^#{prefix}/, x["table"])
    end)
  end

  defp does_end_with_table_prefixes(query) do
    Regex.match?(~r/(from|join)\W+(\S+){0,1}$/i, query)
  end

  defp does_ends_with_table_regex(query) do
    Regex.match?(table_regex_with_ending(), query)
  end

  defp suggest_only_tables(prefix, database_id) do
    from(
      t in Table,
      where: ilike(t.readable_table_name, ^"#{prefix}%") and t.database_id == ^database_id
    )
    |> Repo.all()
    |> Enum.map(fn t ->
      %{
        name: t.readable_table_name,
        value: t.readable_table_name,
        meta: "table",
        score: 1000 / (t.readable_table_name |> String.length())
      }
    end)
  end

  defp suggest_columns(matched_tables, database_id) do
    matched_tables
    |> Enum.reduce([], fn matched_table, acc ->
      acc ++
        (from(
           c in Column,
           left_join: t in Table,
           on: [id: c.table_id],
           where:
             t.database_id == ^database_id and
               t.readable_table_name == ^matched_table["table"]
         )
         |> Repo.all()
         |> Repo.preload(:table)
         |> Enum.map(fn c ->
           name = "#{matched_table["alias"] || matched_table["table"]}.#{c.name}"

           %{
             name: name,
             value: name,
             meta: "column",
             score: 1000 / (name |> String.length())
           }
         end))
    end)
  end

  def autocomplete(database_id, prefix, query) do
    tables = find_tables(query)
    suggest_tables = does_end_with_table_prefixes(query)
    matched_tables = ending_with_alias(query, tables, prefix)

    suggestions = if suggest_tables, do: suggest_only_tables(prefix, database_id), else: []

    suggestions =
      suggestions ++
        if matched_tables && !suggest_tables && !does_ends_with_table_regex(query) do
          suggest_columns(matched_tables, database_id)
        else
          []
        end

    suggestions ++ snippets(prefix)
  end

  defp snippets(prefix) do
    @snippets
    |> Enum.filter(fn {name, _} ->
      Regex.match?(~r/^#{prefix}/, name |> to_string())
    end)
    |> Enum.map(fn {name, value} ->
      %{
        caption: name,
        value: value,
        meta: "snippets",
        score: 5000 / (name |> to_string() |> String.length())
      }
    end)
  end
end
