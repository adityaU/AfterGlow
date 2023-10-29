require IEx

defmodule AfterGlow.Variable do
  use AfterGlow.Web, :model

  @derive {Jason.Encoder,
           only: [:id, :name, :default, :var_type, :default_operator, :default_options]}
  schema "variables" do
    field(:name, :string)
    field(:default, :string)
    field(:var_type, :string)
    field(:default_operator, :string)
    field(:default_options, {:array, :map})
    field(:value, :string, virtual: true)
    belongs_to(:column, AfterGlow.Column)
    belongs_to(:question, AfterGlow.Question)
    belongs_to(:dashboard, AfterGlow.Dashboard)
    belongs_to(:question_filter, AfterGlow.Question)

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [
      :name,
      :default,
      :var_type,
      :column_id,
      :default_operator,
      :default_options,
      :question_filter_id,
      :dashboard_id,
      :question_id,
      :question_filter_id
    ])
    |> cast(params, [:value], empty_values: [])
    |> validate_required([:name, :var_type])
  end

  def cache_deletable_associations do
    [:column, :question, :dashboard, :question_filter]
  end

  defp parse_value(value) when is_integer(value), do: value |> to_string
  defp parse_value(value) when is_float(value), do: value |> to_string

  defp parse_value(value) do
    case value |> Integer.parse() do
      :error ->
        case value |> Float.parse() do
          :error -> "'#{value}'"
          {_value, ""} -> value
          _ -> "'#{value}'"
        end

      {_value, ""} ->
        value

      _ ->
        "'#{value}'"
    end
  end

  def format_value(_variable, "") do
    ""
  end

  def format_value(_variable, nil) do
    ""
  end

  def format_value(variable, value) do
    case variable.var_type do
      "Date" ->
        case NaiveDateTime.from_iso8601(value) do
          {:ok, _date} ->
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
