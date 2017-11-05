defmodule AfterGlow.Table do
  use AfterGlow.Web, :model
  alias AfterGlow.Helpers.String, as: HelperString
  alias AfterGlow.Repo
  alias AfterGlow.Async
  alias AfterGlow.SchemaTasks
  require IEx

  import Ecto.Query, only: [from: 2]

  schema "tables" do
    field :name, :string
    field :readable_table_name, :string
    field :schema_last_updated_at, Ecto.DateTime
    belongs_to :database, AfterGlow.Database
    has_many :columns, AfterGlow.Column

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :readable_table_name, :database_id, :schema_last_updated_at])
    |> validate_required([:name, :readable_table_name, :database_id])
  end

  def create(table_name, db_id) do
    changeset = changeset(%__MODULE__{}, %{name: table_name, readable_table_name: table_name |> HelperString.titlecase, database_id: db_id })
    Repo.insert(changeset)
  end

  def update_all_columns table_id do
    table = Repo.one(from t in __MODULE__, where: t.id == ^table_id)
    if table.schema_last_updated_at do
      {:ok, time_before, _ , _} = Ecto.DateTime.utc |> Calendar.NaiveDateTime.diff(table.schema_last_updated_at)
      if time_before > 4*3600  do
        SchemaTasks.update_columns(table)
      end
    else
      SchemaTasks.update_columns(table)
    end
  end

end
