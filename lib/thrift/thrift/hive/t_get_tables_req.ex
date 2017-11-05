defmodule(Thrift.Hive.TGetTablesReq) do
  _ = "Auto-generated Thrift struct TCLIService.TGetTablesReq"
  _ = "1: TCLIService.TSessionHandle session_handle"
  _ = "2: string catalog_name"
  _ = "3: string schema_name"
  _ = "4: string table_name"
  _ = "5: list<string> table_types"
  defstruct(session_handle: nil, catalog_name: nil, schema_name: nil, table_name: nil, table_types: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TGetTablesReq{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TGetTablesReq{} = acc)) do
      {acc, rest}
    end
    defp(deserialize(<<12, 1::16-signed, rest::binary>>, acc)) do
      case(Elixir.Thrift.Hive.TSessionHandle.BinaryProtocol.deserialize(rest)) do
        {value, rest} ->
          deserialize(rest, %{acc | session_handle: value})
        :error ->
          :error
      end
    end
    defp(deserialize(<<11, 2::16-signed, string_size::32-signed, value::binary-size(string_size), rest::binary>>, acc)) do
      deserialize(rest, %{acc | catalog_name: value})
    end
    defp(deserialize(<<11, 3::16-signed, string_size::32-signed, value::binary-size(string_size), rest::binary>>, acc)) do
      deserialize(rest, %{acc | schema_name: value})
    end
    defp(deserialize(<<11, 4::16-signed, string_size::32-signed, value::binary-size(string_size), rest::binary>>, acc)) do
      deserialize(rest, %{acc | table_name: value})
    end
    defp(deserialize(<<15, 5::16-signed, 11, remaining::32-signed, rest::binary>>, struct)) do
      deserialize__table_types(rest, [[], remaining, struct])
    end
    defp(deserialize(<<field_type, _id::16-signed, rest::binary>>, acc)) do
      rest |> Thrift.Protocol.Binary.skip_field(field_type) |> deserialize(acc)
    end
    defp(deserialize(_, _)) do
      :error
    end
    defp(deserialize__table_types(<<rest::binary>>, [list, 0, struct])) do
      deserialize(rest, %{struct | table_types: Enum.reverse(list)})
    end
    defp(deserialize__table_types(<<string_size::32-signed, element::binary-size(string_size), rest::binary>>, [list, remaining | stack])) do
      deserialize__table_types(rest, [[element | list], remaining - 1 | stack])
    end
    defp(deserialize__table_types(_, _)) do
      :error
    end
    def(serialize(%Thrift.Hive.TGetTablesReq{session_handle: session_handle, catalog_name: catalog_name, schema_name: schema_name, table_name: table_name, table_types: table_types})) do
      [case(session_handle) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :session_handle on Thrift.Hive.TGetTablesReq must not be nil")
        _ ->
          [<<12, 1::16-signed>> | Thrift.Hive.TSessionHandle.serialize(session_handle)]
      end, case(catalog_name) do
        nil ->
          <<>>
        _ ->
          [<<11, 2::16-signed, byte_size(catalog_name)::32-signed>> | catalog_name]
      end, case(schema_name) do
        nil ->
          <<>>
        _ ->
          [<<11, 3::16-signed, byte_size(schema_name)::32-signed>> | schema_name]
      end, case(table_name) do
        nil ->
          <<>>
        _ ->
          [<<11, 4::16-signed, byte_size(table_name)::32-signed>> | table_name]
      end, case(table_types) do
        nil ->
          <<>>
        _ ->
          [<<15, 5::16-signed, 11, length(table_types)::32-signed>> | for(e <- table_types) do
            [<<byte_size(e)::32-signed>> | e]
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