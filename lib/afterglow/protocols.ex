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

defimpl Jason.Encoder, for: Postgrex.INET do
  import Postgrex.BinaryUtils, warn: false

  def encode(address, _options) do
    case address do
      %Postgrex.INET{address: {a, b, c, d}} ->
        "\"#{[a,b,c,d] |> Enum.map(fn x-> x|> to_string() end) |> Enum.join(".")}\""

      %Postgrex.INET{address: {a, b, c, d, e, f, g, h}} ->
        "\"#{[a,b,c,d,e,f,g,h] |> Enum.map(fn x-> x|> to_string() end) |> Enum.join(":")}\""
      other ->
        raise ArgumentError, Postgrex.Utils.encode_msg(other, Postgrex.INET)
    end
  end
end

#
# defimpl Jason.Encoder, for: Ecto.DateTime do
#   def encode(datetime, options) do
#     Ecto.DateTime.to_string(datetime) |> Jason.Encoder.encode(options)
#   end
# end
