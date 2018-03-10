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
    Jason.encode!(map)
  end
end

# defimpl Jason.Encoder, for: BSON.ObjectId do
#   def encode(id, options) do
#     BSON.ObjectId.encode!(id) |> Jason.Encoder.encode(options)
#   end
# end

defimpl Jason.Encoder, for: Ecto.DateTime do
  def encode(datetime, _options) do
    "\"#{Ecto.DateTime.to_string(datetime)}\""
  end
end

#
# defimpl Jason.Encoder, for: Ecto.DateTime do
#   def encode(datetime, options) do
#     Ecto.DateTime.to_string(datetime) |> Jason.Encoder.encode(options)
#   end
# end
