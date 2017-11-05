defmodule(Thrift.Hive.TDoubleValue) do
  _ = "Auto-generated Thrift struct TCLIService.TDoubleValue"
  _ = "1: double value"
  defstruct(value: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TDoubleValue{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TDoubleValue{} = acc)) do
      {acc, rest}
    end
    defp(deserialize(<<4, 1::16-signed, value::float-signed, rest::binary>>, acc)) do
      deserialize(rest, %{acc | value: value})
    end
    defp(deserialize(<<field_type, _id::16-signed, rest::binary>>, acc)) do
      rest |> Thrift.Protocol.Binary.skip_field(field_type) |> deserialize(acc)
    end
    defp(deserialize(_, _)) do
      :error
    end
    def(serialize(%Thrift.Hive.TDoubleValue{value: value})) do
      [case(value) do
        nil ->
          <<>>
        _ ->
          <<4, 1::16-signed, value::float-signed>>
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