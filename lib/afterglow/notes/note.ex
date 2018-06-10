defmodule AfterGlow.Notes.Note do
  use AfterGlow.Web, :model
  alias AfterGlow.Dashboard

  schema "notes" do
    field(:content, :string, null: false)
    belongs_to(:dashboard, Dashboard)
    timestamps()
  end

  def default_preloads do
    [:dashboard]
  end

  def cache_deletable_associations do
    default_preloads
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:content, :dashboard_id])
    |> validate_required([:content])
  end
end
