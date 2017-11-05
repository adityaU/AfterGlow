defmodule(Thrift.Hive.TGetResultSetMetadataResp) do
  _ = "Auto-generated Thrift struct TCLIService.TGetResultSetMetadataResp"
  _ = "1: TCLIService.TStatus status"
  _ = "2: TCLIService.TTableSchema schema"
  defstruct(status: nil, schema: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TGetResultSetMetadataResp{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TGetResultSetMetadataResp{} = acc)) do
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
      case(Elixir.Thrift.Hive.TTableSchema.BinaryProtocol.deserialize(rest)) do
        {value, rest} ->
          deserialize(rest, %{acc | schema: value})
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
    def(serialize(%Thrift.Hive.TGetResultSetMetadataResp{status: status, schema: schema})) do
      [case(status) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :status on Thrift.Hive.TGetResultSetMetadataResp must not be nil")
        _ ->
          [<<12, 1::16-signed>> | Thrift.Hive.TStatus.serialize(status)]
      end, case(schema) do
        nil ->
          <<>>
        _ ->
          [<<12, 2::16-signed>> | Thrift.Hive.TTableSchema.serialize(schema)]
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