defmodule AfterGlow.VariableDashboard do
  use AfterGlow.Web, :model

  schema "variable_dashboards" do
    belongs_to :dashboard, AfterGlow.Dashboard
    belongs_to :variable, AfterGlow.Variable

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
