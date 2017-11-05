defmodule(Thrift.Hive.TGetInfoReq) do
  _ = "Auto-generated Thrift struct TCLIService.TGetInfoReq"
  _ = "1: TCLIService.TSessionHandle session_handle"
  _ = "2: TCLIService.TGetInfoType info_type"
  defstruct(session_handle: nil, info_type: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TGetInfoReq{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TGetInfoReq{} = acc)) do
      {acc, rest}
    end
    defp(deserialize(<<12, 1::16-signed, rest::binary>>, acc)) do
      case(Elixir.Thrift.Hive.TSessionHandle.BinaryProtocol.deserialize(rest)) do
        {value, rest} ->
          deserialize(rest, %{acc | session_handle: value})
        :error ->
          :error
      end
    end
    defp(deserialize(<<8, 2::16-signed, value::32-signed, rest::binary>>, acc)) do
      deserialize(rest, %{acc | info_type: value})
    end
    defp(deserialize(<<field_type, _id::16-signed, rest::binary>>, acc)) do
      rest |> Thrift.Protocol.Binary.skip_field(field_type) |> deserialize(acc)
    end
    defp(deserialize(_, _)) do
      :error
    end
    def(serialize(%Thrift.Hive.TGetInfoReq{session_handle: session_handle, info_type: info_type})) do
      [case(session_handle) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :session_handle on Thrift.Hive.TGetInfoReq must not be nil")
        _ ->
          [<<12, 1::16-signed>> | Thrift.Hive.TSessionHandle.serialize(session_handle)]
      end, case(info_type) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :info_type on Thrift.Hive.TGetInfoReq must not be nil")
        _ ->
          <<8, 2::16-signed, info_type::32-signed>>
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