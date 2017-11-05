defmodule(Thrift.Hive.TTypeQualifierValue) do
  _ = "Auto-generated Thrift union TCLIService.TTypeQualifierValue"
  _ = "1: i32 i32_value"
  _ = "2: string string_value"
  defstruct(i32_value: nil, string_value: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TTypeQualifierValue{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TTypeQualifierValue{} = acc)) do
      {acc, rest}
    end
    defp(deserialize(<<8, 1::16-signed, value::32-signed, rest::binary>>, acc)) do
      deserialize(rest, %{acc | i32_value: value})
    end
    defp(deserialize(<<11, 2::16-signed, string_size::32-signed, value::binary-size(string_size), rest::binary>>, acc)) do
      deserialize(rest, %{acc | string_value: value})
    end
    defp(deserialize(<<field_type, _id::16-signed, rest::binary>>, acc)) do
      rest |> Thrift.Protocol.Binary.skip_field(field_type) |> deserialize(acc)
    end
    defp(deserialize(_, _)) do
      :error
    end
    def(serialize(%Thrift.Hive.TTypeQualifierValue{i32_value: nil, string_value: nil})) do
      <<0>>
    end
    def(serialize(%Thrift.Hive.TTypeQualifierValue{i32_value: i32_value, string_value: nil})) do
      <<8, 1::16-signed, i32_value::32-signed, (<<0>>)>>
    end
    def(serialize(%Thrift.Hive.TTypeQualifierValue{i32_value: nil, string_value: string_value})) do
      [<<11, 2::16-signed, byte_size(string_value)::32-signed>>, string_value | <<0>>]
    end
    def(serialize(%Thrift.Hive.TTypeQualifierValue{} = value)) do
      set_fields = value |> Map.from_struct() |> Enum.flat_map(fn
        {_, nil} ->
          []
        {key, _} ->
          [key]
      end)
      raise(%Thrift.Union.TooManyFieldsSetException{message: "Thrift union has more than one field set", set_fields: set_fields})
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