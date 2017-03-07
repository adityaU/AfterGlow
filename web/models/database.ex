require IEx
defmodule SimpleBase.Database do
  use SimpleBase.Web, :model
  alias SimpleBase.Sql.DbConnection
  alias SimpleBase.Async
  alias SimpleBase.SchemaTasks
  alias SimpleBase.Repo
  schema "databases" do
    field :name, :string
    field :db_type, :string
    field :config, :map
    field :last_accessed_at, Ecto.DateTime
    field :unique_identifier, Ecto.UUID
    has_many :tables, SimpleBase.Table

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :db_type, :config])
    |> validate_required([:name, :db_type, :config])
    |> touch_last_accessed_at
  end


  def insert changeset do
    response = case changeset.errors |> Enum.empty? do
                 true ->
                   changeset = Ecto.Changeset.change(changeset, unique_identifier: Ecto.UUID.generate )
                   case DbConnection.connection(changeset.changes) do
                     {:ok, _} ->
                       {:ok, data} = Repo.insert(changeset)

                     {{:error, error}} ->
                       {:error, error}
                   end
                 false ->
                   {:error, changeset}
               end
    #save schema in async
    Async.perform(&SchemaTasks.sync/1, [response |> elem(1)])
    response
  end

  defp touch_last_accessed_at changeset do
    Ecto.Changeset.change(changeset, last_accessed_at: Ecto.DateTime.utc )
  end


end
