defmodule AfterGlow.Question do
  use AfterGlow.Web, :model
  import EctoEnum, only: [defenum: 2]
  alias AfterGlow.Dashboard
  alias AfterGlow.Database
  alias AfterGlow.Sql.DbConnection
  alias AfterGlow.Tag
  alias AfterGlow.Variable
  alias AfterGlow.TagQuestion
  alias AfterGlow.Widgets.Widget
  alias AfterGlow.Snapshots.Snapshot
  alias AfterGlow.ApiActions.ApiAction
  alias AfterGlow.CacheWrapper.Repo
  import Ecto.Query
  defenum(QueryTypeEnum, human_sql: 0, sql: 1, api_client: 2)

  schema "questions" do
    field(:title, :string)
    field(:last_updated, :utc_datetime)
    field(:sql, :string)
    field(:human_sql, :map)
    field(:results_view_settings, :map)
    field(:cached_results, :map)
    field(:query_type, QueryTypeEnum)
    field(:shareable_link, Ecto.UUID)
    field(:is_shareable_link_public, :boolean)
    field(:columns, {:array, :string})
    field(:shared_to, {:array, :string})
    field(:config, :map)
    belongs_to(:owner, User, foreign_key: :owner_id)

    many_to_many(
      :dashboards,
      Dashboard,
      join_through: "dashboard_questions",
      on_delete: :delete_all
    )

    many_to_many(
      :widgets,
      Widget,
      join_through: "question_widgets",
      on_delete: :delete_all,
      on_replace: :delete
    )

    many_to_many(
      :tags,
      Tag,
      join_through: TagQuestion,
      on_delete: :delete_all,
      on_replace: :delete
    )

    has_many(:variables, Variable, on_delete: :delete_all, on_replace: :delete)
    has_many(:snapshots, Snapshot, on_delete: :delete_all, on_replace: :delete)

    has_many(:api_actions, ApiAction,
      where: [action_level: :question_response],
      on_delete: :delete_all,
      on_replace: :delete
    )

    has_one(:api_action, ApiAction,
      where: [action_level: :question],
      on_delete: :delete_all,
      on_replace: :delete
    )

    timestamps()
  end

  def question_level_api_action(query) do
    from(a in ApiAction, where: a.action_level == 2)
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [
      :title,
      :sql,
      :human_sql,
      :query_type,
      :cached_results,
      :last_updated,
      :shareable_link,
      :is_shareable_link_public,
      :results_view_settings,
      :columns,
      :shared_to,
      :owner_id,
      :config
    ])
    |> cast_assoc(:variables)
    |> validate_required([
      :title,
      :sql,
      :human_sql,
      :query_type,
      :results_view_settings,
      :owner_id
    ])
    |> add_shareable_link
    |> save_sql_from_human_sql
    |> Ecto.Changeset.put_change(:last_updated, DateTime.utc_now() |> DateTime.truncate(:second))
  end

  def default_preloads do
    [
      :variables,
      :tags,
      :dashboards,
      :widgets,
      # :api_actions,
      :api_action,
      [api_actions: from(aa in ApiAction, where: fragment("? is not ?", aa.hidden, true))],
      [snapshots: from(s in Snapshot, where: is_nil(s.parent_id))]
    ]
  end

  def cache_deletable_associations do
    [:variables, :tags, :dashboards, :widgets, :api_actions]
  end

  def update_columns(question, columns, cached_results) do
    cached_results = cached_results |> Jason.encode() |> elem(1)
    # 1 MB results cache
    question =
      case cached_results |> byte_size >= 1_000_000 do
        false ->
          question |> changeset(%{cached_results: cached_results |> Jason.decode() |> elem(1)})

        true ->
          question
      end

    question
    |> changeset(%{columns: columns})
    |> Repo.update_with_cache()
  end

  defp convert_to_variables(vars) do
    vars
    |> Enum.map(fn default_var ->
      default_var

      if default_var |> Map.has_key?(:__struct__) do
        default_var
      else
        Variable.changeset(%Variable{}, default_var).changes
      end
    end)
  end

  def hashed(name) do
    "q_" <>
      (name
       |> String.replace(~r/[^a-zA-Z0-9]/, "_"))
  end

  def replace_variables(query, default_variables, query_variables, snapshot \\ nil) do
    default_variables =
      default_variables
      |> convert_to_variables

    query_variables =
      query_variables
      |> Enum.map(fn v ->
        matched =
          default_variables
          |> Enum.find(fn x ->
            x.name == get_in(v, ["name"]) || hashed(x.name) == get_in(v, ["name"])
          end)

        new_name = if matched, do: matched.name, else: nil
        default_options = if matched, do: matched.default_options, else: nil

        v
        |> Map.merge(%{"name" => new_name, "default_options" => default_options})
      end)
      |> Enum.filter(&get_in(&1, ["name"]))
      |> convert_to_variables

    final_variables =
      default_variables
      |> Enum.map(fn var ->
        q_var =
          query_variables
          |> Enum.filter(fn x ->
            if x.name && var.name do
              x.name == var.name
            end
          end)
          |> Enum.at(0)

        default_options_values = Variable.default_option_values(q_var)

        value =
          if q_var && Map.has_key?(q_var, :value) && (q_var.value || q_var.value == ""),
            do: q_var.value,
            else: if(var |> Map.has_key?(:default), do: var.default, else: nil)

        value = Variable.format_value(var, value)
        value = if default_options_values, do: default_options_values, else: value

        %{
          name: var.name,
          value: value
        }
      end)

    final_variables
    |> Enum.reduce(query, fn variable, query ->
      variable_name = variable.name |> String.trim()

      query
      |> String.replace(~r({{.*#{variable_name}.*?}}), variable.value || "")
    end)
    |> handle_snapshot_starting_at_variable(snapshot)
    |> convert_eex_string(final_variables)
  end

  defp convert_eex_string(query, final_variables) do
    try do
      EEx.eval_string(
        query,
        final_variables
        |> Enum.map(fn variable ->
          {String.to_atom(variable.name), if(variable.value == "", do: nil, else: variable.value)}
        end)
      )
    rescue
      _ ->
        query
    end
  end

  defp handle_snapshot_starting_at_variable(query, nil) do
    query
    |> String.replace(
      ~r({{.*snapshot_starting_at.*}}),
      DateTime.utc_now() |> to_string()
    )
  end

  defp handle_snapshot_starting_at_variable(query, snapshot) do
    query
    |> String.replace(
      ~r({{.*snapshot_starting_at.*}}),
      snapshot.starting_at |> to_string() || ""
    )
  end

  def insert_variables_replaced_at_query(results, variables_replaced_query) do
    results
    |> Tuple.insert_at(
      1,
      results
      |> elem(1)
      |> Map.put("variables_replaced_query", variables_replaced_query)
    )
    |> Tuple.delete_at(2)
  end

  def insert_additional_filters_applied(results, additional_filters_applied) do
    results
    |> Tuple.insert_at(
      1,
      results
      |> elem(1)
      |> Map.put("additional_filters_applied", additional_filters_applied)
    )
    |> Tuple.delete_at(2)
  end

  def insert_final_query(results, final_query) do
    limited_query =
      results
      |> elem(1)
      |> Access.get(:limited_query)

    final_query =
      if limited_query do
        limited_query
      else
        final_query
      end

    results
    |> Tuple.insert_at(
      1,
      results
      |> elem(1)
      |> Map.put("final_query", final_query)
    )
    |> Tuple.delete_at(2)
  end

  def selectable_fields do
    [
      :id,
      :title,
      :last_updated,
      :sql,
      :human_sql,
      :results_view_settings,
      :inserted_at,
      :updated_at,
      :query_type,
      :shared_to
    ]
  end

  def cache_results(question, variables, results) do
    cached_results =
      if used_non_default_variables?(question.variables, variables), do: nil, else: results

    if cached_results do
      if Map.has_key?(cached_results, :columns) do
        question |> update_columns(cached_results.columns, cached_results)
      else
        question |> update_columns([], cached_results)
      end
    end
  end

  defp used_non_default_variables?(default_variables, query_variables) do
    default_values =
      case default_variables |> length == 0 do
        true ->
          false

        false ->
          default_variables
          |> Enum.map(fn var ->
            q_var =
              query_variables |> Enum.filter(fn x -> x["name"] == var.name end) |> Enum.at(0)

            if q_var && q_var["value"], do: q_var["value"] != var.default, else: false
          end)
          |> Enum.any?(fn x -> x end)
      end

    default_options_values =
      case default_variables |> length == 0 do
        true ->
          false

        false ->
          default_variables
          |> Enum.map(fn var ->
            q_var =
              query_variables |> Enum.filter(fn x -> x["name"] == var.name end) |> Enum.at(0)

            if q_var && q_var["default_options"],
              do: q_var["default_options"] != var.default_options,
              else: false
          end)
          |> Enum.any?(fn x -> x end)
      end

    default_options_values || default_values
  end

  defp parse_human_sql(params) do
    %{
      database: params["database"],
      table: params["table"],
      selects: params["views"] |> Enum.map(fn x -> x["selected"] end),
      group_bys:
        params["groupBys"] |> Enum.map(fn x -> [x["selected"], x["castType"]["value"]] end),
      filters: params["filters"],
      order_bys: params["orderBys"],
      limit: params["limit"],
      offset: params["offset"]
    }
  end

  defp save_sql_from_human_sql(changeset) do
    changeset =
      case changeset.changes |> Map.has_key?(:query_type) && changeset.changes.query_type do
        "human_sql" ->
          parsed_human_sql = parse_human_sql(changeset.changes.human_sql)
          db_identifier = parsed_human_sql["database"]["unique_identifier"]
          db_record = Repo.one(from(d in Database, where: d.unique_identifier == ^db_identifier))
          sql = DbConnection.query_string(db_record |> Map.from_struct(), parsed_human_sql)
          changeset |> Ecto.Changeset.change(%{sql: sql})

        _ ->
          changeset
      end

    changeset
  end

  defp add_shareable_link(changeset) do
    changeset =
      case changeset.data.shareable_link do
        nil -> changeset |> Ecto.Changeset.change(shareable_link: Ecto.UUID.generate())
        _ -> changeset
      end

    changeset
  end

  def update(changeset, tags, widgets) do
    tags = if(tags == nil, do: [], else: tags)

    changeset =
      changeset
      |> add_tags(tags)
      |> add_widgets(widgets)
      |> share_variable_question

    Repo.update_with_cache(changeset)
  end

  defp share_variable_question(changeset) do
    if changeset.changes
       |> Map.has_key?(:shared_to) do
      changeset.changes[:variables]
      |> Kernel.||(changeset.data.variables)
      |> Kernel.||([])
      |> Repo.preload(:question_filter)
      |> Enum.filter(fn var -> var.question_filter end)
      |> Enum.map(fn var ->
        if changeset.changes
           |> Map.has_key?(:shared_to) do
          Ecto.Changeset.change(
            var.question_filter,
            shared_to:
              changeset.changes.shared_to
              |> Kernel.++(var.question_filter.shared_to)
              |> Enum.uniq()
          )
          |> Repo.update_with_cache()
        end
      end)
    end

    changeset
  end

  defp add_tags(changeset, tags) do
    changeset |> Ecto.Changeset.put_assoc(:tags, tags)
  end

  defp add_widgets(changeset, widgets) do
    changeset |> Ecto.Changeset.put_assoc(:widgets, widgets || [])
  end
end
