defmodule AfterGlow.Helpers.String do
  def titlecase(value) when is_atom(value), do: value |> to_string |> titlecase
  def titlecase(value) when is_binary(value), do: value |> String.split("_") |> titlecase
  def titlecase(words) when is_list(words) do
    words
    |> Enum.map(&String.capitalize/1)
    |> Enum.join(" ")
  end
end
