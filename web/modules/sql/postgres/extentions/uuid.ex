defmodule AfterGlow.Sql.Postgres.Extensions.UUID do
  @behaviour Postgrex.Extension
  
  import Postgrex.BinaryUtils, warn: false
  use Postgrex.BinaryExtension, send: "uuid_send"

  def init(opts), do: opts

  def encode(_) do
    quote location: :keep do
      uuid when is_binary(uuid) and byte_size(uuid) == 16 ->
        [<<16 :: int32>> | uuid]
      other ->
        raise ArgumentError,
          Postgrex.Utils.encode_msg(other, "a binary of 16 bytes")
    end
  end
  # Use the text format, "ltree" does not have a binary format.

  # Use quoted expression to decode the data to a string. Decoding matches
  # on an encoded binary with the same signed 32bit big endian integer
  # length header.
  def decode(_) do
    quote location: :keep do
      <<16 :: int32, uuid :: binary-16>> -> :binary.copy(uuid) |> Ecto.UUID.load |> elem(1)
    end
  end
end
