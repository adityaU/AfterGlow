defmodule(Thrift.Hive.TGetColumnsReq) do
  _ = "Auto-generated Thrift struct TCLIService.TGetColumnsReq"
  _ = "1: TCLIService.TSessionHandle session_handle"
  _ = "2: string catalog_name"
  _ = "3: string schema_name"
  _ = "4: string table_name"
  _ = "5: string column_name"
  defstruct(session_handle: nil, catalog_name: nil, schema_name: nil, table_name: nil, column_name: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TGetColumnsReq{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TGetColumnsReq{} = acc)) do
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
    defp(deserialize(<<11, 5::16-signed, string_size::32-signed, value::binary-size(string_size), rest::binary>>, acc)) do
      deserialize(rest, %{acc | column_name: value})
    end
    defp(deserialize(<<field_type, _id::16-signed, rest::binary>>, acc)) do
      rest |> Thrift.Protocol.Binary.skip_field(field_type) |> deserialize(acc)
    end
    defp(deserialize(_, _)) do
      :error
    end
    def(serialize(%Thrift.Hive.TGetColumnsReq{session_handle: session_handle, catalog_name: catalog_name, schema_name: schema_name, table_name: table_name, column_name: column_name})) do
      [case(session_handle) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :session_handle on Thrift.Hive.TGetColumnsReq must not be nil")
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
      end, case(column_name) do
        nil ->
          <<>>
        _ ->
          [<<11, 5::16-signed, byte_size(column_name)::32-signed>> | column_name]
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