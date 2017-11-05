defmodule AfterGlow.Database do
  use AfterGlow.Web, :model
  alias AfterGlow.Sql.DbConnection
  alias AfterGlow.Async
  alias AfterGlow.SchemaTasks
  alias AfterGlow.Repo

  schema "databases" do
    field :name, :string
    field :db_url, :string
    field :last_accessed_at, Ecto.DateTime
    field :schema_last_updated_at, Ecto.DateTime
    has_many :tables, AfterGlow.Table

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :db_url, :schema_last_updated_at])
    |> validate_required([:name, :db_url])
  end


  def insert changeset do
    Repo.insert(changeset)
  end

  def update_all_tables db_record, force do
    if force do
      Async.perform(&SchemaTasks.update_tables/1, [db_record])
    else
      if db_record.schema_last_updated_at do
        {:ok, time_before, _ , _} = Ecto.DateTime.utc |> Calendar.NaiveDateTime.diff(db_record.schema_last_updated_at)
        if time_before > 4*3600  do
          Async.perform(&SchemaTasks.update_tables/1, [db_record])
        end
      else
        Async.perform(&SchemaTasks.update_tables/1, [db_record])
      end
    end
  end

  def sync_db db_record do
    Async.perform(&SchemaTasks.update_tables/1, [db_record])
    tables = Repo.all(from t in Table, where: t.database_id == ^db_record.id)
    |> Enum.each(fn t ->
      Async.perform(&SchemaTasks.update_columns/1, [t])
    end)
  end

end
