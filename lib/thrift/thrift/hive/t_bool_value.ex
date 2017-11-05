defmodule(Thrift.Hive.TBoolValue) do
  _ = "Auto-generated Thrift struct TCLIService.TBoolValue"
  _ = "1: bool value"
  defstruct(value: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TBoolValue{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TBoolValue{} = acc)) do
      {acc, rest}
    end
    defp(deserialize(<<2, 1::16-signed, 1, rest::binary>>, acc)) do
      deserialize(rest, %{acc | value: true})
    end
    defp(deserialize(<<2, 1::16-signed, 0, rest::binary>>, acc)) do
      deserialize(rest, %{acc | value: false})
    end
    defp(deserialize(<<field_type, _id::16-signed, rest::binary>>, acc)) do
      rest |> Thrift.Protocol.Binary.skip_field(field_type) |> deserialize(acc)
    end
    defp(deserialize(_, _)) do
      :error
    end
    def(serialize(%Thrift.Hive.TBoolValue{value: value})) do
      [case(value) do
        nil ->
          <<>>
        false ->
          <<2, 1::16-signed, 0>>
        true ->
          <<2, 1::16-signed, 1>>
        _ ->
          raise(Thrift.InvalidValueException, "Optional boolean field :value on Thrift.Hive.TBoolValue must be true, false, or nil")
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