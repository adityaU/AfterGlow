defmodule SimpleBase.Question do
  use SimpleBase.Web, :model

  schema "questions" do
    field :title, :string
    field :update_interval, :integer
    field :last_updated, Ecto.DateTime
    field :sql, :string
    field :human_sql, :map

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:title, :update_interval, :last_updated, :sql, :human_sql])
    |> validate_required([:title, :update_interval, :last_updated, :sql, :human_sql])
  end
end
