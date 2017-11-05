defmodule(Thrift.Hive.TMapTypeEntry) do
  _ = "Auto-generated Thrift struct TCLIService.TMapTypeEntry"
  _ = "1: i32 key_type_ptr"
  _ = "2: i32 value_type_ptr"
  defstruct(key_type_ptr: nil, value_type_ptr: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TMapTypeEntry{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TMapTypeEntry{} = acc)) do
      {acc, rest}
    end
    defp(deserialize(<<8, 1::16-signed, value::32-signed, rest::binary>>, acc)) do
      deserialize(rest, %{acc | key_type_ptr: value})
    end
    defp(deserialize(<<8, 2::16-signed, value::32-signed, rest::binary>>, acc)) do
      deserialize(rest, %{acc | value_type_ptr: value})
    end
    defp(deserialize(<<field_type, _id::16-signed, rest::binary>>, acc)) do
      rest |> Thrift.Protocol.Binary.skip_field(field_type) |> deserialize(acc)
    end
    defp(deserialize(_, _)) do
      :error
    end
    def(serialize(%Thrift.Hive.TMapTypeEntry{key_type_ptr: key_type_ptr, value_type_ptr: value_type_ptr})) do
      [case(key_type_ptr) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :key_type_ptr on Thrift.Hive.TMapTypeEntry must not be nil")
        _ ->
          <<8, 1::16-signed, key_type_ptr::32-signed>>
      end, case(value_type_ptr) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :value_type_ptr on Thrift.Hive.TMapTypeEntry must not be nil")
        _ ->
          <<8, 2::16-signed, value_type_ptr::32-signed>>
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