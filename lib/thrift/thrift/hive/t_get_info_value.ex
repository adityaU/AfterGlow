defmodule(Thrift.Hive.TGetInfoValue) do
  _ = "Auto-generated Thrift union TCLIService.TGetInfoValue"
  _ = "1: string string_value"
  _ = "2: i16 small_int_value"
  _ = "3: i32 integer_bitmask"
  _ = "4: i32 integer_flag"
  _ = "5: i32 binary_value"
  _ = "6: i64 len_value"
  defstruct(string_value: nil, small_int_value: nil, integer_bitmask: nil, integer_flag: nil, binary_value: nil, len_value: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TGetInfoValue{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TGetInfoValue{} = acc)) do
      {acc, rest}
    end
    defp(deserialize(<<11, 1::16-signed, string_size::32-signed, value::binary-size(string_size), rest::binary>>, acc)) do
      deserialize(rest, %{acc | string_value: value})
    end
    defp(deserialize(<<6, 2::16-signed, value::16-signed, rest::binary>>, acc)) do
      deserialize(rest, %{acc | small_int_value: value})
    end
    defp(deserialize(<<8, 3::16-signed, value::32-signed, rest::binary>>, acc)) do
      deserialize(rest, %{acc | integer_bitmask: value})
    end
    defp(deserialize(<<8, 4::16-signed, value::32-signed, rest::binary>>, acc)) do
      deserialize(rest, %{acc | integer_flag: value})
    end
    defp(deserialize(<<8, 5::16-signed, value::32-signed, rest::binary>>, acc)) do
      deserialize(rest, %{acc | binary_value: value})
    end
    defp(deserialize(<<10, 6::16-signed, value::64-signed, rest::binary>>, acc)) do
      deserialize(rest, %{acc | len_value: value})
    end
    defp(deserialize(<<field_type, _id::16-signed, rest::binary>>, acc)) do
      rest |> Thrift.Protocol.Binary.skip_field(field_type) |> deserialize(acc)
    end
    defp(deserialize(_, _)) do
      :error
    end
    def(serialize(%Thrift.Hive.TGetInfoValue{string_value: nil, small_int_value: nil, integer_bitmask: nil, integer_flag: nil, binary_value: nil, len_value: nil})) do
      <<0>>
    end
    def(serialize(%Thrift.Hive.TGetInfoValue{string_value: string_value, small_int_value: nil, integer_bitmask: nil, integer_flag: nil, binary_value: nil, len_value: nil})) do
      [<<11, 1::16-signed, byte_size(string_value)::32-signed>>, string_value | <<0>>]
    end
    def(serialize(%Thrift.Hive.TGetInfoValue{string_value: nil, small_int_value: small_int_value, integer_bitmask: nil, integer_flag: nil, binary_value: nil, len_value: nil})) do
      <<6, 2::16-signed, small_int_value::16-signed, (<<0>>)>>
    end
    def(serialize(%Thrift.Hive.TGetInfoValue{string_value: nil, small_int_value: nil, integer_bitmask: integer_bitmask, integer_flag: nil, binary_value: nil, len_value: nil})) do
      <<8, 3::16-signed, integer_bitmask::32-signed, (<<0>>)>>
    end
    def(serialize(%Thrift.Hive.TGetInfoValue{string_value: nil, small_int_value: nil, integer_bitmask: nil, integer_flag: integer_flag, binary_value: nil, len_value: nil})) do
      <<8, 4::16-signed, integer_flag::32-signed, (<<0>>)>>
    end
    def(serialize(%Thrift.Hive.TGetInfoValue{string_value: nil, small_int_value: nil, integer_bitmask: nil, integer_flag: nil, binary_value: binary_value, len_value: nil})) do
      <<8, 5::16-signed, binary_value::32-signed, (<<0>>)>>
    end
    def(serialize(%Thrift.Hive.TGetInfoValue{string_value: nil, small_int_value: nil, integer_bitmask: nil, integer_flag: nil, binary_value: nil, len_value: len_value})) do
      <<10, 6::16-signed, len_value::64-signed, (<<0>>)>>
    end
    def(serialize(%Thrift.Hive.TGetInfoValue{} = value)) do
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