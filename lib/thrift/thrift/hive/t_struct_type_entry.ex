defmodule(Thrift.Hive.TStructTypeEntry) do
  _ = "Auto-generated Thrift struct TCLIService.TStructTypeEntry"
  _ = "1: map<string,i32> name_to_type_ptr"
  defstruct(name_to_type_ptr: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TStructTypeEntry{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TStructTypeEntry{} = acc)) do
      {acc, rest}
    end
    defp(deserialize(<<13, 1::16-signed, 11, 8, map_size::32-signed, rest::binary>>, struct)) do
      deserialize__name_to_type_ptr__key(rest, [%{}, map_size, struct])
    end
    defp(deserialize(<<field_type, _id::16-signed, rest::binary>>, acc)) do
      rest |> Thrift.Protocol.Binary.skip_field(field_type) |> deserialize(acc)
    end
    defp(deserialize(_, _)) do
      :error
    end
    defp(deserialize__name_to_type_ptr__key(<<rest::binary>>, [map, 0, struct])) do
      deserialize(rest, %{struct | name_to_type_ptr: map})
    end
    defp(deserialize__name_to_type_ptr__key(<<string_size::32-signed, key::binary-size(string_size), rest::binary>>, stack)) do
      deserialize__name_to_type_ptr__value(rest, key, stack)
    end
    defp(deserialize__name_to_type_ptr__key(_, _)) do
      :error
    end
    defp(deserialize__name_to_type_ptr__value(<<value::32-signed, rest::binary>>, key, [map, remaining | stack])) do
      deserialize__name_to_type_ptr__key(rest, [Map.put(map, key, value), remaining - 1 | stack])
    end
    defp(deserialize__name_to_type_ptr__value(_, _, _)) do
      :error
    end
    def(serialize(%Thrift.Hive.TStructTypeEntry{name_to_type_ptr: name_to_type_ptr})) do
      [case(name_to_type_ptr) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :name_to_type_ptr on Thrift.Hive.TStructTypeEntry must not be nil")
        _ ->
          [<<13, 1::16-signed, 11, 8, Enum.count(name_to_type_ptr)::32-signed>> | for({k, v} <- name_to_type_ptr) do
            [<<byte_size(k)::32-signed>>, k | <<v::32-signed>>]
          end]
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