defmodule(Thrift.Hive.TGetOperationStatusResp) do
  _ = "Auto-generated Thrift struct TCLIService.TGetOperationStatusResp"
  _ = "1: TCLIService.TStatus status"
  _ = "2: TCLIService.TOperationState operation_state"
  _ = "3: string sql_state"
  _ = "4: i32 error_code"
  _ = "5: string error_message"
  defstruct(status: nil, operation_state: nil, sql_state: nil, error_code: nil, error_message: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TGetOperationStatusResp{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TGetOperationStatusResp{} = acc)) do
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
      deserialize(rest, %{acc | operation_state: value})
    end
    defp(deserialize(<<11, 3::16-signed, string_size::32-signed, value::binary-size(string_size), rest::binary>>, acc)) do
      deserialize(rest, %{acc | sql_state: value})
    end
    defp(deserialize(<<8, 4::16-signed, value::32-signed, rest::binary>>, acc)) do
      deserialize(rest, %{acc | error_code: value})
    end
    defp(deserialize(<<11, 5::16-signed, string_size::32-signed, value::binary-size(string_size), rest::binary>>, acc)) do
      deserialize(rest, %{acc | error_message: value})
    end
    defp(deserialize(<<field_type, _id::16-signed, rest::binary>>, acc)) do
      rest |> Thrift.Protocol.Binary.skip_field(field_type) |> deserialize(acc)
    end
    defp(deserialize(_, _)) do
      :error
    end
    def(serialize(%Thrift.Hive.TGetOperationStatusResp{status: status, operation_state: operation_state, sql_state: sql_state, error_code: error_code, error_message: error_message})) do
      [case(status) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :status on Thrift.Hive.TGetOperationStatusResp must not be nil")
        _ ->
          [<<12, 1::16-signed>> | Thrift.Hive.TStatus.serialize(status)]
      end, case(operation_state) do
        nil ->
          <<>>
        _ ->
          <<8, 2::16-signed, operation_state::32-signed>>
      end, case(sql_state) do
        nil ->
          <<>>
        _ ->
          [<<11, 3::16-signed, byte_size(sql_state)::32-signed>> | sql_state]
      end, case(error_code) do
        nil ->
          <<>>
        _ ->
          <<8, 4::16-signed, error_code::32-signed>>
      end, case(error_message) do
        nil ->
          <<>>
        _ ->
          [<<11, 5::16-signed, byte_size(error_message)::32-signed>> | error_message]
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