defmodule AfterGlow.Widgets.QuestionWidget do
  use AfterGlow.Web, :model
  alias AfterGlow.Question
  alias AfterGlow.Widgets.Widget

  schema "question_widgets" do
    belongs_to(:question, Question)
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
