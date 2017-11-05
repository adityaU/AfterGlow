defmodule(Thrift.Hive.TGetInfoResp) do
  _ = "Auto-generated Thrift struct TCLIService.TGetInfoResp"
  _ = "1: TCLIService.TStatus status"
  _ = "2: TCLIService.TGetInfoValue info_value"
  defstruct(status: nil, info_value: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TGetInfoResp{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TGetInfoResp{} = acc)) do
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
      case(Elixir.Thrift.Hive.TGetInfoValue.BinaryProtocol.deserialize(rest)) do
        {value, rest} ->
          deserialize(rest, %{acc | info_value: value})
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
    def(serialize(%Thrift.Hive.TGetInfoResp{status: status, info_value: info_value})) do
      [case(status) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :status on Thrift.Hive.TGetInfoResp must not be nil")
        _ ->
          [<<12, 1::16-signed>> | Thrift.Hive.TStatus.serialize(status)]
      end, case(info_value) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :info_value on Thrift.Hive.TGetInfoResp must not be nil")
        _ ->
          [<<12, 2::16-signed>> | Thrift.Hive.TGetInfoValue.serialize(info_value)]
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