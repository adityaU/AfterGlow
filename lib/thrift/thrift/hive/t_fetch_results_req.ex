defmodule(Thrift.Hive.TFetchResultsReq) do
  _ = "Auto-generated Thrift struct TCLIService.TFetchResultsReq"
  _ = "1: TCLIService.TOperationHandle operation_handle"
  _ = "2: TCLIService.TFetchOrientation orientation"
  _ = "3: i64 max_rows"
  _ = "4: i16 fetch_type"
  defstruct(operation_handle: nil, orientation: 1, max_rows: nil, fetch_type: 0)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TFetchResultsReq{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TFetchResultsReq{} = acc)) do
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
    defp(deserialize(<<8, 2::16-signed, value::32-signed, rest::binary>>, acc)) do
      deserialize(rest, %{acc | orientation: value})
    end
    defp(deserialize(<<10, 3::16-signed, value::64-signed, rest::binary>>, acc)) do
      deserialize(rest, %{acc | max_rows: value})
    end
    defp(deserialize(<<6, 4::16-signed, value::16-signed, rest::binary>>, acc)) do
      deserialize(rest, %{acc | fetch_type: value})
    end
    defp(deserialize(<<field_type, _id::16-signed, rest::binary>>, acc)) do
      rest |> Thrift.Protocol.Binary.skip_field(field_type) |> deserialize(acc)
    end
    defp(deserialize(_, _)) do
      :error
    end
    def(serialize(%Thrift.Hive.TFetchResultsReq{operation_handle: operation_handle, orientation: orientation, max_rows: max_rows, fetch_type: fetch_type})) do
      [case(operation_handle) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :operation_handle on Thrift.Hive.TFetchResultsReq must not be nil")
        _ ->
          [<<12, 1::16-signed>> | Thrift.Hive.TOperationHandle.serialize(operation_handle)]
      end, case(orientation) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :orientation on Thrift.Hive.TFetchResultsReq must not be nil")
        _ ->
          <<8, 2::16-signed, orientation::32-signed>>
      end, case(max_rows) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :max_rows on Thrift.Hive.TFetchResultsReq must not be nil")
        _ ->
          <<10, 3::16-signed, max_rows::64-signed>>
      end, case(fetch_type) do
        nil ->
          <<>>
        _ ->
          <<6, 4::16-signed, fetch_type::16-signed>>
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