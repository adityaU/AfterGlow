defmodule(Thrift.Hive.TColumnValue) do
  _ = "Auto-generated Thrift union TCLIService.TColumnValue"
  _ = "1: TCLIService.TBoolValue bool_val"
  _ = "2: TCLIService.TByteValue byte_val"
  _ = "3: TCLIService.TI16Value i16_val"
  _ = "4: TCLIService.TI32Value i32_val"
  _ = "5: TCLIService.TI64Value i64_val"
  _ = "6: TCLIService.TDoubleValue double_val"
  _ = "7: TCLIService.TStringValue string_val"
  defstruct(bool_val: nil, byte_val: nil, i16_val: nil, i32_val: nil, i64_val: nil, double_val: nil, string_val: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TColumnValue{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TColumnValue{} = acc)) do
      {acc, rest}
    end
    defp(deserialize(<<12, 1::16-signed, rest::binary>>, acc)) do
      case(Elixir.Thrift.Hive.TBoolValue.BinaryProtocol.deserialize(rest)) do
        {value, rest} ->
          deserialize(rest, %{acc | bool_val: value})
        :error ->
          :error
      end
    end
    defp(deserialize(<<12, 2::16-signed, rest::binary>>, acc)) do
      case(Elixir.Thrift.Hive.TByteValue.BinaryProtocol.deserialize(rest)) do
        {value, rest} ->
          deserialize(rest, %{acc | byte_val: value})
        :error ->
          :error
      end
    end
    defp(deserialize(<<12, 3::16-signed, rest::binary>>, acc)) do
      case(Elixir.Thrift.Hive.TI16Value.BinaryProtocol.deserialize(rest)) do
        {value, rest} ->
          deserialize(rest, %{acc | i16_val: value})
        :error ->
          :error
      end
    end
    defp(deserialize(<<12, 4::16-signed, rest::binary>>, acc)) do
      case(Elixir.Thrift.Hive.TI32Value.BinaryProtocol.deserialize(rest)) do
        {value, rest} ->
          deserialize(rest, %{acc | i32_val: value})
        :error ->
          :error
      end
    end
    defp(deserialize(<<12, 5::16-signed, rest::binary>>, acc)) do
      case(Elixir.Thrift.Hive.TI64Value.BinaryProtocol.deserialize(rest)) do
        {value, rest} ->
          deserialize(rest, %{acc | i64_val: value})
        :error ->
          :error
      end
    end
    defp(deserialize(<<12, 6::16-signed, rest::binary>>, acc)) do
      case(Elixir.Thrift.Hive.TDoubleValue.BinaryProtocol.deserialize(rest)) do
        {value, rest} ->
          deserialize(rest, %{acc | double_val: value})
        :error ->
          :error
      end
    end
    defp(deserialize(<<12, 7::16-signed, rest::binary>>, acc)) do
      case(Elixir.Thrift.Hive.TStringValue.BinaryProtocol.deserialize(rest)) do
        {value, rest} ->
          deserialize(rest, %{acc | string_val: value})
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
    def(serialize(%Thrift.Hive.TColumnValue{bool_val: nil, byte_val: nil, i16_val: nil, i32_val: nil, i64_val: nil, double_val: nil, string_val: nil})) do
      <<0>>
    end
    def(serialize(%Thrift.Hive.TColumnValue{bool_val: bool_val, byte_val: nil, i16_val: nil, i32_val: nil, i64_val: nil, double_val: nil, string_val: nil})) do
      [<<12, 1::16-signed>>, Thrift.Hive.TBoolValue.serialize(bool_val) | <<0>>]
    end
    def(serialize(%Thrift.Hive.TColumnValue{bool_val: nil, byte_val: byte_val, i16_val: nil, i32_val: nil, i64_val: nil, double_val: nil, string_val: nil})) do
      [<<12, 2::16-signed>>, Thrift.Hive.TByteValue.serialize(byte_val) | <<0>>]
    end
    def(serialize(%Thrift.Hive.TColumnValue{bool_val: nil, byte_val: nil, i16_val: i16_val, i32_val: nil, i64_val: nil, double_val: nil, string_val: nil})) do
      [<<12, 3::16-signed>>, Thrift.Hive.TI16Value.serialize(i16_val) | <<0>>]
    end
    def(serialize(%Thrift.Hive.TColumnValue{bool_val: nil, byte_val: nil, i16_val: nil, i32_val: i32_val, i64_val: nil, double_val: nil, string_val: nil})) do
      [<<12, 4::16-signed>>, Thrift.Hive.TI32Value.serialize(i32_val) | <<0>>]
    end
    def(serialize(%Thrift.Hive.TColumnValue{bool_val: nil, byte_val: nil, i16_val: nil, i32_val: nil, i64_val: i64_val, double_val: nil, string_val: nil})) do
      [<<12, 5::16-signed>>, Thrift.Hive.TI64Value.serialize(i64_val) | <<0>>]
    end
    def(serialize(%Thrift.Hive.TColumnValue{bool_val: nil, byte_val: nil, i16_val: nil, i32_val: nil, i64_val: nil, double_val: double_val, string_val: nil})) do
      [<<12, 6::16-signed>>, Thrift.Hive.TDoubleValue.serialize(double_val) | <<0>>]
    end
    def(serialize(%Thrift.Hive.TColumnValue{bool_val: nil, byte_val: nil, i16_val: nil, i32_val: nil, i64_val: nil, double_val: nil, string_val: string_val})) do
      [<<12, 7::16-signed>>, Thrift.Hive.TStringValue.serialize(string_val) | <<0>>]
    end
    def(serialize(%Thrift.Hive.TColumnValue{} = value)) do
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