defmodule AfterGlow.Variable do
  use AfterGlow.Web, :model

  schema "variables" do
    field :name, :string
    field :default, :string
    field :var_type, :string
    field :default_operator, :string
    belongs_to :column, AfterGlow.Column

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :default, :var_type, :column_id, :default_operator])
    |> validate_required([:name, :default, :var_type])
  end
end
