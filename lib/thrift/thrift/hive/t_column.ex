defmodule(Thrift.Hive.TColumn) do
  _ = "Auto-generated Thrift union TCLIService.TColumn"
  _ = "1: TCLIService.TBoolColumn bool_val"
  _ = "2: TCLIService.TByteColumn byte_val"
  _ = "3: TCLIService.TI16Column i16_val"
  _ = "4: TCLIService.TI32Column i32_val"
  _ = "5: TCLIService.TI64Column i64_val"
  _ = "6: TCLIService.TDoubleColumn double_val"
  _ = "7: TCLIService.TStringColumn string_val"
  _ = "8: TCLIService.TBinaryColumn binary_val"
  defstruct(bool_val: nil, byte_val: nil, i16_val: nil, i32_val: nil, i64_val: nil, double_val: nil, string_val: nil, binary_val: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TColumn{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TColumn{} = acc)) do
      {acc, rest}
    end
    defp(deserialize(<<12, 1::16-signed, rest::binary>>, acc)) do
      case(Elixir.Thrift.Hive.TBoolColumn.BinaryProtocol.deserialize(rest)) do
        {value, rest} ->
          deserialize(rest, %{acc | bool_val: value})
        :error ->
          :error
      end
    end
    defp(deserialize(<<12, 2::16-signed, rest::binary>>, acc)) do
      case(Elixir.Thrift.Hive.TByteColumn.BinaryProtocol.deserialize(rest)) do
        {value, rest} ->
          deserialize(rest, %{acc | byte_val: value})
        :error ->
          :error
      end
    end
    defp(deserialize(<<12, 3::16-signed, rest::binary>>, acc)) do
      case(Elixir.Thrift.Hive.TI16Column.BinaryProtocol.deserialize(rest)) do
        {value, rest} ->
          deserialize(rest, %{acc | i16_val: value})
        :error ->
          :error
      end
    end
    defp(deserialize(<<12, 4::16-signed, rest::binary>>, acc)) do
      case(Elixir.Thrift.Hive.TI32Column.BinaryProtocol.deserialize(rest)) do
        {value, rest} ->
          deserialize(rest, %{acc | i32_val: value})
        :error ->
          :error
      end
    end
    defp(deserialize(<<12, 5::16-signed, rest::binary>>, acc)) do
      case(Elixir.Thrift.Hive.TI64Column.BinaryProtocol.deserialize(rest)) do
        {value, rest} ->
          deserialize(rest, %{acc | i64_val: value})
        :error ->
          :error
      end
    end
    defp(deserialize(<<12, 6::16-signed, rest::binary>>, acc)) do
      case(Elixir.Thrift.Hive.TDoubleColumn.BinaryProtocol.deserialize(rest)) do
        {value, rest} ->
          deserialize(rest, %{acc | double_val: value})
        :error ->
          :error
      end
    end
    defp(deserialize(<<12, 7::16-signed, rest::binary>>, acc)) do
      case(Elixir.Thrift.Hive.TStringColumn.BinaryProtocol.deserialize(rest)) do
        {value, rest} ->
          deserialize(rest, %{acc | string_val: value})
        :error ->
          :error
      end
    end
    defp(deserialize(<<12, 8::16-signed, rest::binary>>, acc)) do
      case(Elixir.Thrift.Hive.TBinaryColumn.BinaryProtocol.deserialize(rest)) do
        {value, rest} ->
          deserialize(rest, %{acc | binary_val: value})
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
    def(serialize(%Thrift.Hive.TColumn{bool_val: nil, byte_val: nil, i16_val: nil, i32_val: nil, i64_val: nil, double_val: nil, string_val: nil, binary_val: nil})) do
      <<0>>
    end
    def(serialize(%Thrift.Hive.TColumn{bool_val: bool_val, byte_val: nil, i16_val: nil, i32_val: nil, i64_val: nil, double_val: nil, string_val: nil, binary_val: nil})) do
      [<<12, 1::16-signed>>, Thrift.Hive.TBoolColumn.serialize(bool_val) | <<0>>]
    end
    def(serialize(%Thrift.Hive.TColumn{bool_val: nil, byte_val: byte_val, i16_val: nil, i32_val: nil, i64_val: nil, double_val: nil, string_val: nil, binary_val: nil})) do
      [<<12, 2::16-signed>>, Thrift.Hive.TByteColumn.serialize(byte_val) | <<0>>]
    end
    def(serialize(%Thrift.Hive.TColumn{bool_val: nil, byte_val: nil, i16_val: i16_val, i32_val: nil, i64_val: nil, double_val: nil, string_val: nil, binary_val: nil})) do
      [<<12, 3::16-signed>>, Thrift.Hive.TI16Column.serialize(i16_val) | <<0>>]
    end
    def(serialize(%Thrift.Hive.TColumn{bool_val: nil, byte_val: nil, i16_val: nil, i32_val: i32_val, i64_val: nil, double_val: nil, string_val: nil, binary_val: nil})) do
      [<<12, 4::16-signed>>, Thrift.Hive.TI32Column.serialize(i32_val) | <<0>>]
    end
    def(serialize(%Thrift.Hive.TColumn{bool_val: nil, byte_val: nil, i16_val: nil, i32_val: nil, i64_val: i64_val, double_val: nil, string_val: nil, binary_val: nil})) do
      [<<12, 5::16-signed>>, Thrift.Hive.TI64Column.serialize(i64_val) | <<0>>]
    end
    def(serialize(%Thrift.Hive.TColumn{bool_val: nil, byte_val: nil, i16_val: nil, i32_val: nil, i64_val: nil, double_val: double_val, string_val: nil, binary_val: nil})) do
      [<<12, 6::16-signed>>, Thrift.Hive.TDoubleColumn.serialize(double_val) | <<0>>]
    end
    def(serialize(%Thrift.Hive.TColumn{bool_val: nil, byte_val: nil, i16_val: nil, i32_val: nil, i64_val: nil, double_val: nil, string_val: string_val, binary_val: nil})) do
      [<<12, 7::16-signed>>, Thrift.Hive.TStringColumn.serialize(string_val) | <<0>>]
    end
    def(serialize(%Thrift.Hive.TColumn{bool_val: nil, byte_val: nil, i16_val: nil, i32_val: nil, i64_val: nil, double_val: nil, string_val: nil, binary_val: binary_val})) do
      [<<12, 8::16-signed>>, Thrift.Hive.TBinaryColumn.serialize(binary_val) | <<0>>]
    end
    def(serialize(%Thrift.Hive.TColumn{} = value)) do
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