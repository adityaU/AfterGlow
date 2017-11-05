defmodule(Thrift.Hive.TOpenSessionResp) do
  _ = "Auto-generated Thrift struct TCLIService.TOpenSessionResp"
  _ = "1: TCLIService.TStatus status"
  _ = "2: TCLIService.TProtocolVersion server_protocol_version"
  _ = "3: TCLIService.TSessionHandle session_handle"
  _ = "4: map<string,string> configuration"
  defstruct(status: nil, server_protocol_version: 8, session_handle: nil, configuration: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TOpenSessionResp{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TOpenSessionResp{} = acc)) do
      {acc, rest}
    end
    defp(deserialize(<<12, 1::16-signed, rest::binary>>, acc)) do
      case(Elixir.Thrift.Hive.TStatus.BinaryProtocol.deserialize(rest)) do
        {value, rest} ->
          deserialize(rest, %{acc | status: value})
        :error ->
          :error
      end
    end
    defp(deserialize(<<8, 2::16-signed, value::32-signed, rest::binary>>, acc)) do
      deserialize(rest, %{acc | server_protocol_version: value})
    end
    defp(deserialize(<<12, 3::16-signed, rest::binary>>, acc)) do
      case(Elixir.Thrift.Hive.TSessionHandle.BinaryProtocol.deserialize(rest)) do
        {value, rest} ->
          deserialize(rest, %{acc | session_handle: value})
        :error ->
          :error
      end
    end
    defp(deserialize(<<13, 4::16-signed, 11, 11, map_size::32-signed, rest::binary>>, struct)) do
      deserialize__configuration__key(rest, [%{}, map_size, struct])
    end
    defp(deserialize(<<field_type, _id::16-signed, rest::binary>>, acc)) do
      rest |> Thrift.Protocol.Binary.skip_field(field_type) |> deserialize(acc)
    end
    defp(deserialize(_, _)) do
      :error
    end
    defp(deserialize__configuration__key(<<rest::binary>>, [map, 0, struct])) do
      deserialize(rest, %{struct | configuration: map})
    end
    defp(deserialize__configuration__key(<<string_size::32-signed, key::binary-size(string_size), rest::binary>>, stack)) do
      deserialize__configuration__value(rest, key, stack)
    end
    defp(deserialize__configuration__key(_, _)) do
      :error
    end
    defp(deserialize__configuration__value(<<string_size::32-signed, value::binary-size(string_size), rest::binary>>, key, [map, remaining | stack])) do
      deserialize__configuration__key(rest, [Map.put(map, key, value), remaining - 1 | stack])
    end
    defp(deserialize__configuration__value(_, _, _)) do
      :error
    end
    def(serialize(%Thrift.Hive.TOpenSessionResp{status: status, server_protocol_version: server_protocol_version, session_handle: session_handle, configuration: configuration})) do
      [case(status) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :status on Thrift.Hive.TOpenSessionResp must not be nil")
        _ ->
          [<<12, 1::16-signed>> | Thrift.Hive.TStatus.serialize(status)]
      end, case(server_protocol_version) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :server_protocol_version on Thrift.Hive.TOpenSessionResp must not be nil")
        _ ->
          <<8, 2::16-signed, server_protocol_version::32-signed>>
      end, case(session_handle) do
        nil ->
          <<>>
        _ ->
          [<<12, 3::16-signed>> | Thrift.Hive.TSessionHandle.serialize(session_handle)]
      end, case(configuration) do
        nil ->
          <<>>
        _ ->
          [<<13, 4::16-signed, 11, 11, Enum.count(configuration)::32-signed>> | for({k, v} <- configuration) do
            [<<byte_size(k)::32-signed>>, k, <<byte_size(v)::32-signed>> | v]
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