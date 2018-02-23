defmodule AfterGlow.Question do
  use AfterGlow.Web, :model
  import EctoEnum, only: [defenum: 2]
  alias AfterGlow.Dashboard
  alias AfterGlow.Sql.DbConnection
  alias AfterGlow.Tag
  alias AfterGlow.Variable
  alias AfterGlow.TagQuestion
  alias AfterGlow.Mailers.CsvMailer
  alias AfterGlow.Snapshots.Snapshot
  alias AfterGlow.VariableQuestion
  alias ExAws.S3
  alias AfterGlow.CacheWrapper.Repo
  defenum QueryTypeEnum, human_sql: 0, sql: 1
  
  schema "questions" do
    field :title, :string
    field :last_updated, Ecto.DateTime
    field :sql, :string
    field :human_sql, :map
    field :results_view_settings, :map
    field :cached_results, :map
    field :query_type, QueryTypeEnum
    field :shareable_link, Ecto.UUID
    field :is_shareable_link_public, :boolean
    field :columns, {:array, :string}
    field :shared_to, {:array, :string}
    belongs_to :owner, User, foreign_key: :owner_id
    many_to_many :dashboards, Dashboard, join_through: "dashboard_questions",  on_delete: :delete_all
    many_to_many :tags, Tag, join_through: TagQuestion, on_delete: :delete_all, on_replace: :delete
    has_many :variables, Variable, on_delete: :delete_all, on_replace: :delete
    has_many :snapshots, Snapshot, on_delete: :delete_all, on_replace: :delete

    timestamps()
  end
  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:title, :sql, :human_sql, :query_type, :cached_results, :last_updated, :shareable_link, :is_shareable_link_public, :results_view_settings, :columns, :shared_to, :owner_id])
    |> cast_assoc(:variables)
    |> validate_required([:title, :sql, :human_sql, :query_type, :results_view_settings, :owner_id])
    |> add_shareable_link
    |> save_sql_from_human_sql
    |> Ecto.Changeset.put_change(:last_updated, Ecto.DateTime.utc )
  end

  def default_preloads do
    [:variables, :snapshots, :tags, :dashboards]
  end

  def cache_deletable_associations do
    [:variables, :tags, :dashboards]
  end

  def update_columns(question, columns, cached_results) do
    cached_results = cached_results |> Poison.encode |> elem(1)
    case cached_results |> byte_size >= 1000000 do # 1 MB results cache
      false ->
        question = question |> changeset(%{cached_results: (cached_results |> Poison.decode |> elem(1))}) 
      true ->
        "pass"
    end
    question
    |> changeset(%{columns: columns})
    |> Repo.update_with_cache
  end

  def replace_variables(query, default_variables, query_variables) do
    same_variables = false
    if default_variables == query_variables do
      same_variables = true
    end
    query_variables = query_variables
    |> Enum.map(fn var ->
      var
      |> Enum.reduce(%{}, fn ({key, val}, acc) -> Map.put(acc, String.to_atom(key), val) end)
    end)
    variables = if same_variables, do: query_variables, else: default_variables
    variables = variables 
    |> Enum.map(fn var->
      q_var = query_variables |> Enum.filter(fn x -> x.name == var.name end) |> Enum.at(0)
      default_options_values = Variable.default_option_values(q_var)
      value = if q_var && q_var.value, do: q_var.value, else: var.default
      value = Variable.format_value(var, value)
      value = if default_options_values, do: default_options_values, else: value
      %{
        name: var.name,
        value: value 
      }
    end)
    variables
    |> Enum.reduce(query, fn variable, query ->
      variable_name = variable.name |> String.strip()
      query
      |> String.replace(~r({{.*#{variable_name}.*}}), variable.value || "")
    end)
  end

  def insert_variables_replaced_at_query(results, variables_replaced_query) do
    results
    |> Tuple.insert_at(1, results
    |> elem(1)
    |> Map.put("variables_replaced_query" ,variables_replaced_query)
    )
    |> Tuple.delete_at(2)
  end

  def selectable_fields do

    [:id, :title, :last_updated, :sql, :human_sql, :results_view_settings, :inserted_at, :updated_at, :query_type, :shared_to]
  end

  def cache_results(question, variables, results) do
    cached_results = if used_non_default_variables?(question.variables, variables), do: nil, else: results
    if cached_results do
      question |> update_columns(cached_results.columns, cached_results)
    end
  end

  defp used_non_default_variables?(default_variables, query_variables) do
    case default_variables |> length == 0 do
      true ->
        false
      false->
        default_variables
        |> Enum.map(fn var->
          q_var = query_variables |> Enum.filter(fn x -> x["name"] == var.name end) |> Enum.at(0)
          if q_var && q_var["value"], do: q_var["value"] != var.default, else: false
        end)
        |> Enum.any?(fn x -> x end)
    end
  end

  defp parse_human_sql(params) do
    %{
      database:  params["database"],
      table:     params["table"],
      selects:   params["views"]|> Enum.map(fn x-> x["selected"] end),
      group_bys: params["groupBys"] |> Enum.map(fn x-> [x["selected"], x["castType"]["value"]] end),
      filters:   params["filters"],
      order_bys: params["orderBys"],
      limit:     params["limit"],
      offset:    params["offset"]
    }
  end

  defp save_sql_from_human_sql(changeset) do
    case (changeset.changes|> Map.has_key?(:query_type)) && changeset.changes.query_type  do
      "human_sql" -> 
        parsed_human_sql = parse_human_sql changeset.changes.human_sql
        db_identifier = parsed_human_sql["database"]["unique_identifier"]
        db_record = Repo.one(from d in Database, where: d.unique_identifier == ^db_identifier)
        sql = DbConnection.query_string(db_record |> Map.from_struct, parsed_human_sql )
        changeset = changeset |> Ecto.Changeset.change(:sql, sql)
       _ -> 
         "pass"
    end
    changeset
  end

  defp add_shareable_link(changeset) do
    case changeset.data.shareable_link do
      nil -> changeset = changeset |> Ecto.Changeset.change(shareable_link: Ecto.UUID.generate)
      _ -> 'pass'
    end
    changeset
  end

  def update(changeset, tags) do
    tags = if(tags == nil,  do: [], else: tags)
    changeset = changeset
    |> add_tags(tags)
    Repo.update_with_cache(changeset)
  end

  defp add_tags(changeset, tags) do
      changeset |> Ecto.Changeset.put_assoc(:tags, tags)
  end

end
