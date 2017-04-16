defmodule AfterGlow.Question do
  use AfterGlow.Web, :model
  import EctoEnum, only: [defenum: 2]
  alias AfterGlow.Dashboard
  alias AfterGlow.DbConnection
  alias AfterGlow.Tag
  alias AfterGlow.Variable
  alias AfterGlow.TagQuestion
  alias AfterGlow.VariableQuestion
  alias AfterGlow.Repo
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
    many_to_many :dashboards, Dashboard, join_through: "dashboard_questions",  on_delete: :delete_all
    many_to_many :tags, Tag, join_through: TagQuestion, on_delete: :delete_all, on_replace: :delete
    many_to_many :variables, Variable, join_through: VariableQuestion, on_delete: :delete_all, on_replace: :delete

    timestamps()
  end
  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:title, :sql, :human_sql, :query_type, :cached_results, :last_updated, :shareable_link, :is_shareable_link_public, :results_view_settings, :columns])
    |> validate_required([:title, :sql, :human_sql, :query_type, :results_view_settings])
    |> add_shareable_link
    |> save_sql_from_human_sql
    |> Ecto.Changeset.put_change(:last_updated, Ecto.DateTime.utc )
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
    |> Repo.update!
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

  def update(changeset, tags, variables) do
    tags = if(tags == nil,  do: [], else: tags)
    variables = if(variables == nil,  do: [], else: variables)
    changeset = changeset
    |> add_tags(tags)
    |> add_variables(variables)
    Repo.update(changeset)
  end

  defp add_tags(changeset, tags) do
      changeset |> Ecto.Changeset.put_assoc(:tags, tags)
  end
  defp add_variables(changeset, variables) do
    changeset |> Ecto.Changeset.put_assoc(:variables, variables)
  end
end
