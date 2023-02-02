defmodule AfterGlow.Dashboards.DashboardQuestion do
  use AfterGlow.Web, :model
  alias AfterGlow.Dashboard

  @primary_key false
  schema "dashboard_questions" do
    field(:dashboard_id, :integer)
    field(:question_id, :integer)
    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:dashboard_id, :question_id])
    |> validate_required([:dashboard_id, :question_id])
  end
end
