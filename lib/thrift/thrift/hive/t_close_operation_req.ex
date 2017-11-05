defmodule(Thrift.Hive.TCloseOperationReq) do
  _ = "Auto-generated Thrift struct TCLIService.TCloseOperationReq"
  _ = "1: TCLIService.TOperationHandle operation_handle"
  defstruct(operation_handle: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TCloseOperationReq{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TCloseOperationReq{} = acc)) do
      {acc, rest}
    end
    defp(deserialize(<<12, 1::16-signed, rest::binary>>, acc)) do
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
    def(serialize(%Thrift.Hive.TCloseOperationReq{operation_handle: operation_handle})) do
      [case(operation_handle) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :operation_handle on Thrift.Hive.TCloseOperationReq must not be nil")
        _ ->
          [<<12, 1::16-signed>> | Thrift.Hive.TOperationHandle.serialize(operation_handle)]
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