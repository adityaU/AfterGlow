defmodule(Thrift.Hive.TPrimitiveTypeEntry) do
  _ = "Auto-generated Thrift struct TCLIService.TPrimitiveTypeEntry"
  _ = "1: TCLIService.TTypeId type"
  _ = "2: TCLIService.TTypeQualifiers type_qualifiers"
  defstruct(type: nil, type_qualifiers: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TPrimitiveTypeEntry{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TPrimitiveTypeEntry{} = acc)) do
      {acc, rest}
    end
    defp(deserialize(<<8, 1::16-signed, value::32-signed, rest::binary>>, acc)) do
      deserialize(rest, %{acc | type: value})
    end
    defp(deserialize(<<12, 2::16-signed, rest::binary>>, acc)) do
      case(Elixir.Thrift.Hive.TTypeQualifiers.BinaryProtocol.deserialize(rest)) do
        {value, rest} ->
          deserialize(rest, %{acc | type_qualifiers: value})
        :error ->
          :error
      end
    end
    defp(deserialize(<<field_type, _id::16-signed, rest::binary>>, acc)) do
      rest |> Thrift.Protocol.Binary.skip_field(field_type) |> deserialize(acc)
    end
    defp(deserialize(_, _)) do
      :error
    end
    def(serialize(%Thrift.Hive.TPrimitiveTypeEntry{type: type, type_qualifiers: type_qualifiers})) do
      [case(type) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :type on Thrift.Hive.TPrimitiveTypeEntry must not be nil")
        _ ->
          <<8, 1::16-signed, type::32-signed>>
      end, case(type_qualifiers) do
        nil ->
          <<>>
        _ ->
          [<<12, 2::16-signed>> | Thrift.Hive.TTypeQualifiers.serialize(type_qualifiers)]
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