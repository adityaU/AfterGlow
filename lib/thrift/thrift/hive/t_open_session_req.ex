defmodule(Thrift.Hive.TOpenSessionReq) do
  _ = "Auto-generated Thrift struct TCLIService.TOpenSessionReq"
  _ = "1: TCLIService.TProtocolVersion client_protocol"
  _ = "2: string username"
  _ = "3: string password"
  _ = "4: map<string,string> configuration"
  defstruct(client_protocol: 8, username: nil, password: nil, configuration: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TOpenSessionReq{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TOpenSessionReq{} = acc)) do
      {acc, rest}
    end
    defp(deserialize(<<8, 1::16-signed, value::32-signed, rest::binary>>, acc)) do
      deserialize(rest, %{acc | client_protocol: value})
    end
    defp(deserialize(<<11, 2::16-signed, string_size::32-signed, value::binary-size(string_size), rest::binary>>, acc)) do
      deserialize(rest, %{acc | username: value})
    end
    defp(deserialize(<<11, 3::16-signed, string_size::32-signed, value::binary-size(string_size), rest::binary>>, acc)) do
      deserialize(rest, %{acc | password: value})
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
    def(serialize(%Thrift.Hive.TOpenSessionReq{client_protocol: client_protocol, username: username, password: password, configuration: configuration})) do
      [case(client_protocol) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :client_protocol on Thrift.Hive.TOpenSessionReq must not be nil")
        _ ->
          <<8, 1::16-signed, client_protocol::32-signed>>
      end, case(username) do
        nil ->
          <<>>
        _ ->
          [<<11, 2::16-signed, byte_size(username)::32-signed>> | username]
      end, case(password) do
        nil ->
          <<>>
        _ ->
          [<<11, 3::16-signed, byte_size(password)::32-signed>> | password]
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