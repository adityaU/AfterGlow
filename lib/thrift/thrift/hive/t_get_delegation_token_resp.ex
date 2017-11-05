defmodule(Thrift.Hive.TGetDelegationTokenResp) do
  _ = "Auto-generated Thrift struct TCLIService.TGetDelegationTokenResp"
  _ = "1: TCLIService.TStatus status"
  _ = "2: string delegation_token"
  defstruct(status: nil, delegation_token: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TGetDelegationTokenResp{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TGetDelegationTokenResp{} = acc)) do
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
    defp(deserialize(<<11, 2::16-signed, string_size::32-signed, value::binary-size(string_size), rest::binary>>, acc)) do
      deserialize(rest, %{acc | delegation_token: value})
    end
    defp(deserialize(<<field_type, _id::16-signed, rest::binary>>, acc)) do
      rest |> Thrift.Protocol.Binary.skip_field(field_type) |> deserialize(acc)
    end
    defp(deserialize(_, _)) do
      :error
    end
    def(serialize(%Thrift.Hive.TGetDelegationTokenResp{status: status, delegation_token: delegation_token})) do
      [case(status) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :status on Thrift.Hive.TGetDelegationTokenResp must not be nil")
        _ ->
          [<<12, 1::16-signed>> | Thrift.Hive.TStatus.serialize(status)]
      end, case(delegation_token) do
        nil ->
          <<>>
        _ ->
          [<<11, 2::16-signed, byte_size(delegation_token)::32-signed>> | delegation_token]
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