defmodule(Thrift.Hive.TOperationHandle) do
  _ = "Auto-generated Thrift struct TCLIService.TOperationHandle"
  _ = "1: TCLIService.THandleIdentifier operation_id"
  _ = "2: TCLIService.TOperationType operation_type"
  _ = "3: bool has_result_set"
  _ = "4: double modified_row_count"
  defstruct(operation_id: nil, operation_type: nil, has_result_set: nil, modified_row_count: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TOperationHandle{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TOperationHandle{} = acc)) do
      {acc, rest}
    end
    defp(deserialize(<<12, 1::16-signed, rest::binary>>, acc)) do
      case(Elixir.Thrift.Hive.THandleIdentifier.BinaryProtocol.deserialize(rest)) do
        {value, rest} ->
          deserialize(rest, %{acc | operation_id: value})
        :error ->
          :error
      end
    end
    defp(deserialize(<<8, 2::16-signed, value::32-signed, rest::binary>>, acc)) do
      deserialize(rest, %{acc | operation_type: value})
    end
    defp(deserialize(<<2, 3::16-signed, 1, rest::binary>>, acc)) do
      deserialize(rest, %{acc | has_result_set: true})
    end
    defp(deserialize(<<2, 3::16-signed, 0, rest::binary>>, acc)) do
      deserialize(rest, %{acc | has_result_set: false})
    end
    defp(deserialize(<<4, 4::16-signed, value::float-signed, rest::binary>>, acc)) do
      deserialize(rest, %{acc | modified_row_count: value})
    end
    defp(deserialize(<<field_type, _id::16-signed, rest::binary>>, acc)) do
      rest |> Thrift.Protocol.Binary.skip_field(field_type) |> deserialize(acc)
    end
    defp(deserialize(_, _)) do
      :error
    end
    def(serialize(%Thrift.Hive.TOperationHandle{operation_id: operation_id, operation_type: operation_type, has_result_set: has_result_set, modified_row_count: modified_row_count})) do
      [case(operation_id) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :operation_id on Thrift.Hive.TOperationHandle must not be nil")
        _ ->
          [<<12, 1::16-signed>> | Thrift.Hive.THandleIdentifier.serialize(operation_id)]
      end, case(operation_type) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :operation_type on Thrift.Hive.TOperationHandle must not be nil")
        _ ->
          <<8, 2::16-signed, operation_type::32-signed>>
      end, case(has_result_set) do
        false ->
          <<2, 3::16-signed, 0>>
        true ->
          <<2, 3::16-signed, 1>>
        _ ->
          raise(Thrift.InvalidValueException, "Required boolean field :has_result_set on Thrift.Hive.TOperationHandle must be true or false")
      end, case(modified_row_count) do
        nil ->
          <<>>
        _ ->
          <<4, 4::16-signed, modified_row_count::float-signed>>
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