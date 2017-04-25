require IEx
defmodule AfterGlow.Variable do
  use AfterGlow.Web, :model

  schema "variables" do
    field :name, :string
    field :default, :string
    field :var_type, :string
    field :default_operator, :string
    belongs_to :column, AfterGlow.Column
    belongs_to :question, AfterGlow.Question
    belongs_to :dashboard, AfterGlow.Dashboard

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :default, :var_type, :column_id, :default_operator, :dashboard_id, :question_id])
    |> validate_required([:name, :default, :var_type])
  end

  def format_value(variable, value) do
    case variable.var_type do
      "Date" ->
        case Ecto.DateTime.cast(value) do
          {:ok, date}->
            "'#{value}'"
          _ ->
            value
        end
      "String" ->
        "'#{value}'"
      "Integer" ->
        value
    end
  end
end
