defmodule AfterGlow.VariableQuestion do
  use AfterGlow.Web, :model

  schema "variable_questions" do
    belongs_to :question, AfterGlow.Question
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
