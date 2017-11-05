defmodule(Thrift.Hive.TGetCatalogsResp) do
  _ = "Auto-generated Thrift struct TCLIService.TGetCatalogsResp"
  _ = "1: TCLIService.TStatus status"
  _ = "2: TCLIService.TOperationHandle operation_handle"
  defstruct(status: nil, operation_handle: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TGetCatalogsResp{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TGetCatalogsResp{} = acc)) do
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
    defp(deserialize(<<12, 2::16-signed, rest::binary>>, acc)) do
      case(Elixir.Thrift.Hive.TOperationHandle.BinaryProtocol.deserialize(rest)) do
        {value, rest} ->
          deserialize(rest, %{acc | operation_handle: value})
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
    def(serialize(%Thrift.Hive.TGetCatalogsResp{status: status, operation_handle: operation_handle})) do
      [case(status) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :status on Thrift.Hive.TGetCatalogsResp must not be nil")
        _ ->
          [<<12, 1::16-signed>> | Thrift.Hive.TStatus.serialize(status)]
      end, case(operation_handle) do
        nil ->
          <<>>
        _ ->
          [<<12, 2::16-signed>> | Thrift.Hive.TOperationHandle.serialize(operation_handle)]
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