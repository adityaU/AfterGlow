defmodule(Thrift.Hive.TGetSchemasReq) do
  _ = "Auto-generated Thrift struct TCLIService.TGetSchemasReq"
  _ = "1: TCLIService.TSessionHandle session_handle"
  _ = "2: string catalog_name"
  _ = "3: string schema_name"
  defstruct(session_handle: nil, catalog_name: nil, schema_name: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TGetSchemasReq{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TGetSchemasReq{} = acc)) do
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
    defp(deserialize(<<field_type, _id::16-signed, rest::binary>>, acc)) do
      rest |> Thrift.Protocol.Binary.skip_field(field_type) |> deserialize(acc)
    end
    defp(deserialize(_, _)) do
      :error
    end
    def(serialize(%Thrift.Hive.TGetSchemasReq{session_handle: session_handle, catalog_name: catalog_name, schema_name: schema_name})) do
      [case(session_handle) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :session_handle on Thrift.Hive.TGetSchemasReq must not be nil")
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