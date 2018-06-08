defmodule AfterGlow.Widgets.Widget do
  use AfterGlow.Web, :model
  alias AfterGlow.Widgets.WidgetItem

  import EctoEnum, only: [defenum: 2]

  defenum(
    RendererEnum,
    progress_bar: 0,
    circular_progress_bar: 1,
    icon_and_text: 2,
    direction: 3,
    tag: 4,
    ratings: 5,
    row_color: 6,
    row_border: 7,
    prefix: 8,
    suffix: 9
  )

  schema "widgets" do
    field(:column_name, :string, null: false)
    field(:name, :string, null: false)
    field(:renderer, RendererEnum)
    has_many(:widget_items, WidgetItem, on_delete: :delete_all, on_replace: :delete)

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :column_name, :renderer])
    |> validate_required([:name, :column_name, :renderer])
  end
end
