defmodule(Thrift.Hive.THandleIdentifier) do
  _ = "Auto-generated Thrift struct TCLIService.THandleIdentifier"
  _ = "1: binary guid"
  _ = "2: binary secret"
  defstruct(guid: nil, secret: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.THandleIdentifier{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.THandleIdentifier{} = acc)) do
      {acc, rest}
    end
    defp(deserialize(<<11, 1::16-signed, string_size::32-signed, value::binary-size(string_size), rest::binary>>, acc)) do
      deserialize(rest, %{acc | guid: value})
    end
    defp(deserialize(<<11, 2::16-signed, string_size::32-signed, value::binary-size(string_size), rest::binary>>, acc)) do
      deserialize(rest, %{acc | secret: value})
    end
    defp(deserialize(<<field_type, _id::16-signed, rest::binary>>, acc)) do
      rest |> Thrift.Protocol.Binary.skip_field(field_type) |> deserialize(acc)
    end
    defp(deserialize(_, _)) do
      :error
    end
    def(serialize(%Thrift.Hive.THandleIdentifier{guid: guid, secret: secret})) do
      [case(guid) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :guid on Thrift.Hive.THandleIdentifier must not be nil")
        _ ->
          [<<11, 1::16-signed, byte_size(guid)::32-signed>> | guid]
      end, case(secret) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :secret on Thrift.Hive.THandleIdentifier must not be nil")
        _ ->
          [<<11, 2::16-signed, byte_size(secret)::32-signed>> | secret]
      end | <<0>>]
    end
  end
  def(serialize(struct)) do
    BinaryProtocol.serialize(struct)
  end
  def(serialize(struct, :binary)) do
    BinaryProtocol.serialize(struct)
  end
  def(deserialize(binary)) do
    BinaryProtocol.deserialize(binary)
  end
end