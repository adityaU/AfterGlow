defmodule(Thrift.Hive.TByteValue) do
  _ = "Auto-generated Thrift struct TCLIService.TByteValue"
  _ = "1: i8 value"
  defstruct(value: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TByteValue{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TByteValue{} = acc)) do
      {acc, rest}
    end
    defp(deserialize(<<3, 1::16-signed, value::8-signed, rest::binary>>, acc)) do
      deserialize(rest, %{acc | value: value})
    end
    defp(deserialize(<<field_type, _id::16-signed, rest::binary>>, acc)) do
      rest |> Thrift.Protocol.Binary.skip_field(field_type) |> deserialize(acc)
    end
    defp(deserialize(_, _)) do
      :error
    end
    def(serialize(%Thrift.Hive.TByteValue{value: value})) do
      [case(value) do
        nil ->
          <<>>
        _ ->
          <<3, 1::16-signed, value::8-signed>>
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