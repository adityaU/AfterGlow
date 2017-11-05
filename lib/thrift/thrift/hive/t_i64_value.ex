defmodule(Thrift.Hive.TI64Value) do
  _ = "Auto-generated Thrift struct TCLIService.TI64Value"
  _ = "1: i64 value"
  defstruct(value: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TI64Value{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TI64Value{} = acc)) do
      {acc, rest}
    end
    defp(deserialize(<<10, 1::16-signed, value::64-signed, rest::binary>>, acc)) do
      deserialize(rest, %{acc | value: value})
    end
    defp(deserialize(<<field_type, _id::16-signed, rest::binary>>, acc)) do
      rest |> Thrift.Protocol.Binary.skip_field(field_type) |> deserialize(acc)
    end
    defp(deserialize(_, _)) do
      :error
    end
    def(serialize(%Thrift.Hive.TI64Value{value: value})) do
      [case(value) do
        nil ->
          <<>>
        _ ->
          <<10, 1::16-signed, value::64-signed>>
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