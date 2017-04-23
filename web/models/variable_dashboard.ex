defmodule AfterGlow.VariableDashboard do
  use AfterGlow.Web, :model

  schema "variable_dashboards" do
    belongs_to :dashboard, AfterGlow.Dashboard
    field :name, :string
    field :default, :string

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [])
    |> validate_required([])
  end
end
