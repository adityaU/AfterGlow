defmodule AfterGlow.Widgets.WidgetItem do
  use AfterGlow.Web, :model
  alias AfterGlow.Widgets.Widget

  schema "widget_items" do
    field(:text, :string)
    field(:value, :string)
    field(:config, {:map, :string})
    belongs_to(:widget, Widget)
    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:text, :value, :config, :widget_id])
    |> validate_required([:value, :widget_id])
  end
end
