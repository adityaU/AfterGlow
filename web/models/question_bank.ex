defmodule AfterGlow.QuestionBank do
  use AfterGlow.Web, :model

  schema "question_banks" do
    field :title, :string
    field :questions, {:array, :integer}

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:title, :questions])
    |> validate_required([:title, :questions])
  end
end
