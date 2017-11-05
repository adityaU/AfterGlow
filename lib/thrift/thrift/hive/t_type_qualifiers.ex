defmodule(Thrift.Hive.TTypeQualifiers) do
  _ = "Auto-generated Thrift struct TCLIService.TTypeQualifiers"
  _ = "1: map<string,TCLIService.TTypeQualifierValue> qualifiers"
  defstruct(qualifiers: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TTypeQualifiers{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TTypeQualifiers{} = acc)) do
      {acc, rest}
    end
    defp(deserialize(<<13, 1::16-signed, 11, 12, map_size::32-signed, rest::binary>>, struct)) do
      deserialize__qualifiers__key(rest, [%{}, map_size, struct])
    end
    defp(deserialize(<<field_type, _id::16-signed, rest::binary>>, acc)) do
      rest |> Thrift.Protocol.Binary.skip_field(field_type) |> deserialize(acc)
    end
    defp(deserialize(_, _)) do
      :error
    end
    defp(deserialize__qualifiers__key(<<rest::binary>>, [map, 0, struct])) do
      deserialize(rest, %{struct | qualifiers: map})
    end
    defp(deserialize__qualifiers__key(<<string_size::32-signed, key::binary-size(string_size), rest::binary>>, stack)) do
      deserialize__qualifiers__value(rest, key, stack)
    end
    defp(deserialize__qualifiers__key(_, _)) do
      :error
    end
    defp(deserialize__qualifiers__value(<<rest::binary>>, key, [map, remaining | stack])) do
      case(Elixir.Thrift.Hive.TTypeQualifierValue.BinaryProtocol.deserialize(rest)) do
        {value, rest} ->
          deserialize__qualifiers__key(rest, [Map.put(map, key, value), remaining - 1 | stack])
        :error ->
          :error
      end
    end
    defp(deserialize__qualifiers__value(_, _, _)) do
      :error
    end
    def(serialize(%Thrift.Hive.TTypeQualifiers{qualifiers: qualifiers})) do
      [case(qualifiers) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :qualifiers on Thrift.Hive.TTypeQualifiers must not be nil")
        _ ->
          [<<13, 1::16-signed, 11, 12, Enum.count(qualifiers)::32-signed>> | for({k, v} <- qualifiers) do
            [<<byte_size(k)::32-signed>>, k | Thrift.Hive.TTypeQualifierValue.serialize(v)]
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