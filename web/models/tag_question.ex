defmodule AfterGlow.TagQuestion do
  use AfterGlow.Web, :model

  schema "tag_questions" do
    belongs_to :tag, AfterGlow.Tag
    belongs_to :question, AfterGlow.Question
    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:tag_id, :question_id])
    |> validate_required([:tag_id, :question_id])
  end
end
