require IEx
defmodule AfterGlow.Variable do
  use AfterGlow.Web, :model

  schema "variables" do
    field :name, :string
    field :default, :string
    field :var_type, :string
    field :default_operator, :string
    field :default_options, {:array, :map}
    belongs_to :column, AfterGlow.Column
    belongs_to :question, AfterGlow.Question
    belongs_to :dashboard, AfterGlow.Dashboard
    belongs_to :question_filter, AfterGlow.Question

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :default, :var_type, :column_id, :default_operator, :default_options, :question_filter_id, :dashboard_id, :question_id, :question_filter_id])
    |> make_default_from_default_options(params)
    |> validate_required([:name, :default, :var_type])
  end

  def make_default_from_default_options(changeset, params) do
    changeset = case changeset.data.default_options do
                  nil -> changeset
                  _ -> changeset |> Ecto.Changeset.change(
                      default: changeset.data.default_options
                      |> default_option_values_from_default_options
                  )

    end
    changeset

  end

  def cache_deletable_associations do
    [:column, :question, :dashboard, :question_filter]
  end

  def default_option_values_from_default_options(default_options) do
    default_options
    |> Enum.map(fn x ->
      case  x["value"] |> Integer.parse do
        :error -> case x["value"] |> Float.parse do
                    :error -> "'#{x["value"]}'"
                    {_value, "" } ->  x["value"]
                    _ -> "'#{x["value"]}'"
                  end
        {_value, "" } ->  x["value"]
        _ -> "'#{x["value"]}'"
      end

    end)
    |> Enum.join(", ")
  end

  def default_option_values(variable) do
    if variable.default_options |> length > 0 do
      variable.default_options
      |> default_option_values_from_default_options
    else
      nil
    end
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
      "Dynamic" ->
        value
    end
  end
end
