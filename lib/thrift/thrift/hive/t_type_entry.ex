defmodule(Thrift.Hive.TTypeEntry) do
  _ = "Auto-generated Thrift union TCLIService.TTypeEntry"
  _ = "1: TCLIService.TPrimitiveTypeEntry primitive_entry"
  _ = "2: TCLIService.TArrayTypeEntry array_entry"
  _ = "3: TCLIService.TMapTypeEntry map_entry"
  _ = "4: TCLIService.TStructTypeEntry struct_entry"
  _ = "5: TCLIService.TUnionTypeEntry union_entry"
  _ = "6: TCLIService.TUserDefinedTypeEntry user_defined_type_entry"
  defstruct(primitive_entry: nil, array_entry: nil, map_entry: nil, struct_entry: nil, union_entry: nil, user_defined_type_entry: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TTypeEntry{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TTypeEntry{} = acc)) do
      {acc, rest}
    end
    defp(deserialize(<<12, 1::16-signed, rest::binary>>, acc)) do
      case(Elixir.Thrift.Hive.TPrimitiveTypeEntry.BinaryProtocol.deserialize(rest)) do
        {value, rest} ->
          deserialize(rest, %{acc | primitive_entry: value})
        :error ->
          :error
      end
    end
    defp(deserialize(<<12, 2::16-signed, rest::binary>>, acc)) do
      case(Elixir.Thrift.Hive.TArrayTypeEntry.BinaryProtocol.deserialize(rest)) do
        {value, rest} ->
          deserialize(rest, %{acc | array_entry: value})
        :error ->
          :error
      end
    end
    defp(deserialize(<<12, 3::16-signed, rest::binary>>, acc)) do
      case(Elixir.Thrift.Hive.TMapTypeEntry.BinaryProtocol.deserialize(rest)) do
        {value, rest} ->
          deserialize(rest, %{acc | map_entry: value})
        :error ->
          :error
      end
    end
    defp(deserialize(<<12, 4::16-signed, rest::binary>>, acc)) do
      case(Elixir.Thrift.Hive.TStructTypeEntry.BinaryProtocol.deserialize(rest)) do
        {value, rest} ->
          deserialize(rest, %{acc | struct_entry: value})
        :error ->
          :error
      end
    end
    defp(deserialize(<<12, 5::16-signed, rest::binary>>, acc)) do
      case(Elixir.Thrift.Hive.TUnionTypeEntry.BinaryProtocol.deserialize(rest)) do
        {value, rest} ->
          deserialize(rest, %{acc | union_entry: value})
        :error ->
          :error
      end
    end
    defp(deserialize(<<12, 6::16-signed, rest::binary>>, acc)) do
      case(Elixir.Thrift.Hive.TUserDefinedTypeEntry.BinaryProtocol.deserialize(rest)) do
        {value, rest} ->
          deserialize(rest, %{acc | user_defined_type_entry: value})
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
    def(serialize(%Thrift.Hive.TTypeEntry{primitive_entry: nil, array_entry: nil, map_entry: nil, struct_entry: nil, union_entry: nil, user_defined_type_entry: nil})) do
      <<0>>
    end
    def(serialize(%Thrift.Hive.TTypeEntry{primitive_entry: primitive_entry, array_entry: nil, map_entry: nil, struct_entry: nil, union_entry: nil, user_defined_type_entry: nil})) do
      [<<12, 1::16-signed>>, Thrift.Hive.TPrimitiveTypeEntry.serialize(primitive_entry) | <<0>>]
    end
    def(serialize(%Thrift.Hive.TTypeEntry{primitive_entry: nil, array_entry: array_entry, map_entry: nil, struct_entry: nil, union_entry: nil, user_defined_type_entry: nil})) do
      [<<12, 2::16-signed>>, Thrift.Hive.TArrayTypeEntry.serialize(array_entry) | <<0>>]
    end
    def(serialize(%Thrift.Hive.TTypeEntry{primitive_entry: nil, array_entry: nil, map_entry: map_entry, struct_entry: nil, union_entry: nil, user_defined_type_entry: nil})) do
      [<<12, 3::16-signed>>, Thrift.Hive.TMapTypeEntry.serialize(map_entry) | <<0>>]
    end
    def(serialize(%Thrift.Hive.TTypeEntry{primitive_entry: nil, array_entry: nil, map_entry: nil, struct_entry: struct_entry, union_entry: nil, user_defined_type_entry: nil})) do
      [<<12, 4::16-signed>>, Thrift.Hive.TStructTypeEntry.serialize(struct_entry) | <<0>>]
    end
    def(serialize(%Thrift.Hive.TTypeEntry{primitive_entry: nil, array_entry: nil, map_entry: nil, struct_entry: nil, union_entry: union_entry, user_defined_type_entry: nil})) do
      [<<12, 5::16-signed>>, Thrift.Hive.TUnionTypeEntry.serialize(union_entry) | <<0>>]
    end
    def(serialize(%Thrift.Hive.TTypeEntry{primitive_entry: nil, array_entry: nil, map_entry: nil, struct_entry: nil, union_entry: nil, user_defined_type_entry: user_defined_type_entry})) do
      [<<12, 6::16-signed>>, Thrift.Hive.TUserDefinedTypeEntry.serialize(user_defined_type_entry) | <<0>>]
    end
    def(serialize(%Thrift.Hive.TTypeEntry{} = value)) do
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