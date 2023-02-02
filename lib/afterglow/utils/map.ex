defmodule AfterGlow.Utils.Map do
  def get(map, key) when is_atom(key) do
    map
    |> get_in([key])
    |> Kernel.||(map |> get_in([key |> to_string()]))
  end

  def get(map, key) when is_binary(key) do
    map
    |> get_in([key])
    |> Kernel.||(map |> get_in([key |> String.to_atom()]))
  end
end
