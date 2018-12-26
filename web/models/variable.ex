require IEx

defmodule AfterGlow.Variable do
  use AfterGlow.Web, :model

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
      :value,
      :question_filter_id
    ])
    |> make_default_from_default_options
    |> validate_required([:name, :default, :var_type])
  end

  def make_default_from_default_options(changeset) do
    default_options =
      (changeset.changes
       |> Map.has_key?(:default_options) && changeset.changes.default_options) ||
        (changeset.data
         |> Map.has_key?(:default_options) && changeset.data.default_options)

    changeset =
      case default_options do
        nil ->
          changeset

        [] ->
          changeset

        _ ->
          changeset
          |> Ecto.Changeset.change(
            default:
              default_options
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
      x["value"] |> parse_value
    end)
    |> Enum.join(", ")
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

  def default_option_values(nil), do: nil

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
          {:ok, date} ->
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
