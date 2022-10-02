defmodule AfterGlow.Widgets.DashboardWidget do
  use AfterGlow.Web, :model
  alias AfterGlow.Dashboard

  schema "dashboard_widgets" do
    field(:dashboard_id, :integer)
    field(:widget_id, :integer)
    field(:widget_type, :string)
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
