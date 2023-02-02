defmodule AfterGlow.Utils.Integer do
  def parse_integer(value) when is_binary(value) do
    case value |> Integer.parse() do
      :error -> nil
      parsed -> parsed |> elem(0)
    end
  end

  def parse_integer(value) when is_integer(value), do: value
  def parse_integer(value) when is_float(value), do: parse_integer(value |> to_string)
  def parse_integer(value), do: nil
end
