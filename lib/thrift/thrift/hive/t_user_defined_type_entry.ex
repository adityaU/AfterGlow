defmodule(Thrift.Hive.TUserDefinedTypeEntry) do
  _ = "Auto-generated Thrift struct TCLIService.TUserDefinedTypeEntry"
  _ = "1: string type_class_name"
  defstruct(type_class_name: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TUserDefinedTypeEntry{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TUserDefinedTypeEntry{} = acc)) do
      {acc, rest}
    end
    defp(deserialize(<<11, 1::16-signed, string_size::32-signed, value::binary-size(string_size), rest::binary>>, acc)) do
      deserialize(rest, %{acc | type_class_name: value})
    end
    defp(deserialize(<<field_type, _id::16-signed, rest::binary>>, acc)) do
      rest |> Thrift.Protocol.Binary.skip_field(field_type) |> deserialize(acc)
    end
    defp(deserialize(_, _)) do
      :error
    end
    def(serialize(%Thrift.Hive.TUserDefinedTypeEntry{type_class_name: type_class_name})) do
      [case(type_class_name) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :type_class_name on Thrift.Hive.TUserDefinedTypeEntry must not be nil")
        _ ->
          [<<11, 1::16-signed, byte_size(type_class_name)::32-signed>> | type_class_name]
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