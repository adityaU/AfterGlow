defmodule AfterGlow.Explorations do
  import Ecto.Query
  alias AfterGlow.Repo
  alias AfterGlow.Column
  alias AfterGlow.Table
  alias AfterGlow.Sql.DbConnection
  alias AfterGlow.ForeignKey
  import AfterGlow.Sql.QueryRunner

  def get_row_and_dependencies(column_id, value, frontend_limit) do
    column = Repo.get!(Column, column_id) |> Repo.preload(:table)
    table = column.table |> Repo.preload(:database)
    database = table.database

    params = %{
      "database" => database,
      "table" => %{"id" => table.id, "name" => table.name},
      "filters" => [
        %{
          "column" => %{"name" => column.name},
          "operator" => %{"name" => "is", "value" => "="},
          "value" => value,
          "valueDateObj" => %{"date" => false}
        }
      ],
      "variables" => []
    }

    {_query, results} = run_query_from_object(database, params, frontend_limit)
    {:ok, results} = results

    %{
      results: results,
      dependencies: dependencies(table),
      value: value,
      column_id: column_id,
      table_name: table.readable_table_name,
      column_name: column.name
    }
  end

  def get_dependency(
        column_id,
        foreign_column_id,
        table_id,
        value,
        value_column_id,
        frontend_limit
      ) do
    table = Repo.get!(Table, table_id) |> Repo.preload(:database) |> Repo.preload(:columns)
    column = Repo.get!(Column, column_id) |> Repo.preload(:table)
    value_column = Repo.get!(Column, value_column_id) |> Repo.preload(:table)
    foreign_column = Repo.get!(Column, foreign_column_id) |> Repo.preload(:table)
    database = table.database

    raw_query =
      DbConnection.make_dependency_raw_query(
        database |> Map.from_struct(),
        column,
        foreign_column,
        table,
        value,
        value_column,
        Table.primary_keys(table.id)
      )

    params = %{
      "database" => database,
      :raw_query => raw_query,
      :variables => []
    }

    {_q, results} = run_raw_query(database, params, frontend_limit)
    {:ok, results} = Table.insert_foreign_key_columns_in_results(results, table)
    %{results: results}
  end

  defp dependencies(table) do
    table = table |> Repo.preload(:columns)

    column_ids =
      table.columns
      |> Enum.map(fn c -> c.id end)

    from(fk in ForeignKey)
    |> where([fk], fk.column_id in ^column_ids)
    |> or_where([fk], fk.foreign_column_id in ^column_ids)
    |> Repo.all()
    |> Repo.preload(column: :table)
    |> Repo.preload(foreign_column: :table)
    |> Enum.map(fn fk ->
      if fk.column.table.id == table.id do
        [
          %{
            id: fk.foreign_column.table.id,
            name: fk.foreign_column.table.readable_table_name,
            column_id: fk.column_id,
            foreign_column_id: fk.foreign_column_id
          }
        ]
      else
        [
          %{
            id: fk.column.table.id,
            name: fk.column.table.readable_table_name,
            column_id: fk.foreign_column_id,
            foreign_column_id: fk.column_id
          }
        ]
      end
    end)
    |> List.flatten()
    |> List.flatten()
    |> Enum.uniq()
    |> Enum.filter(fn x ->
      x[:name] != table.readable_table_name
    end)
  end

  def dependencies_and_raw_queries(column_id, value) do
    column = Repo.get!(Column, column_id) |> Repo.preload(:table)
    table = column.table |> Repo.preload(:database)
    database = table.database

    params =
      %{
        "database" => database,
        "table" => %{"id" => table.id, "name" => table.name},
        "filters" => [
          %{
            "column" => %{"name" => column.name},
            "operator" => %{"name" => "is", "value" => "="},
            "value" => "{{#{column.name}}}",
            "valueDateObj" => %{"date" => false}
          }
        ],
        "variables" => []
      }
      |> permit_params()

    primary_question = %{
      table: table.readable_table_name,
      raw_query: DbConnection.query_string(database |> Map.from_struct(), params)
    }

    dependencies =
      dependencies(table)
      |> Enum.map(fn dep ->
        dep_column = Repo.get!(Column, dep[:column_id]) |> Repo.preload(:table) |> IO.inspect(label: "column")
        dep_foreign_column = Repo.get!(Column, dep[:foreign_column_id]) |> Repo.preload(:table) |> IO.inspect(label: "column")
        dep_table = Repo.get(Table, dep[:id]) 
        value_column = column |> Repo.preload(:table)


        %{
          table: dep[:name],
          raw_query:
            DbConnection.make_dependency_raw_query(
              database |> Map.from_struct(),
              dep_column,
              dep_foreign_column,
              dep_table,
              "{{#{column.name}}}",
              value_column,
              Table.primary_keys(table.id)
            )
        }
      end)

    %{
      database: database,
      primary_question: primary_question,
      dependencies: dependencies,
      value: value,
      column_name: column.name
    }
  end
end
