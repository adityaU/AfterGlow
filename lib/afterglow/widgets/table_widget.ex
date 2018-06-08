defmodule AfterGlow.Widgets.TableWidget do
  use AfterGlow.Web, :model
  alias AfterGlow.Table
  alias AfterGlow.Widgets.Widget

  schema "table_widgets" do
    belongs_to(:table, Table)
    belongs_to(:widget, Widget)
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
