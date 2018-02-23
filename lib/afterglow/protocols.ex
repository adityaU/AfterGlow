defimpl String.Chars, for: Tuple do
  def to_string(tuple) do
    interior =
      tuple
      |> Tuple.to_list()
      |> Enum.map(&Kernel.to_string/1)
      |> Enum.join(", ")

    "{#{interior}}"
  end
end

defimpl String.Chars, for: Map do
  def to_string(map) do
    Poison.encode!(map)
  end
end
