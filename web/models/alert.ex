defmodule AfterGlow.Alert do
  use AfterGlow.Web, :model
  alias AfterGlow.Question


  schema "alerts" do
    field :name, :string
    field :config, :map
    belongs_to :question_id, Question
    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :config, :question_id])
    |> validate_required([:name, :config, :question_id])
  end

end
