defmodule(Thrift.Hive.TArrayTypeEntry) do
  _ = "Auto-generated Thrift struct TCLIService.TArrayTypeEntry"
  _ = "1: i32 object_type_ptr"
  defstruct(object_type_ptr: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TArrayTypeEntry{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TArrayTypeEntry{} = acc)) do
      {acc, rest}
    end
    defp(deserialize(<<8, 1::16-signed, value::32-signed, rest::binary>>, acc)) do
      deserialize(rest, %{acc | object_type_ptr: value})
    end
    defp(deserialize(<<field_type, _id::16-signed, rest::binary>>, acc)) do
      rest |> Thrift.Protocol.Binary.skip_field(field_type) |> deserialize(acc)
    end
    defp(deserialize(_, _)) do
      :error
    end
    def(serialize(%Thrift.Hive.TArrayTypeEntry{object_type_ptr: object_type_ptr})) do
      [case(object_type_ptr) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :object_type_ptr on Thrift.Hive.TArrayTypeEntry must not be nil")
        _ ->
          <<8, 1::16-signed, object_type_ptr::32-signed>>
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