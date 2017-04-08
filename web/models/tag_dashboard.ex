defmodule AfterGlow.TagDashboard do
  use AfterGlow.Web, :model

  schema "tag_dashboards" do
    belongs_to :tag, AfterGlow.Tag
    belongs_to :dashboard, AfterGlow.Dashboard
    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:tag_id, :dashboard_id])
    |> validate_required([:tag_id, :dashboard_id])
  end
end
