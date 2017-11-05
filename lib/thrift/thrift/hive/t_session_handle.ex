defmodule(Thrift.Hive.TSessionHandle) do
  _ = "Auto-generated Thrift struct TCLIService.TSessionHandle"
  _ = "1: TCLIService.THandleIdentifier session_id"
  defstruct(session_id: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TSessionHandle{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TSessionHandle{} = acc)) do
      {acc, rest}
    end
    defp(deserialize(<<12, 1::16-signed, rest::binary>>, acc)) do
      case(Elixir.Thrift.Hive.THandleIdentifier.BinaryProtocol.deserialize(rest)) do
        {value, rest} ->
          deserialize(rest, %{acc | session_id: value})
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
    def(serialize(%Thrift.Hive.TSessionHandle{session_id: session_id})) do
      [case(session_id) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :session_id on Thrift.Hive.TSessionHandle must not be nil")
        _ ->
          [<<12, 1::16-signed>> | Thrift.Hive.THandleIdentifier.serialize(session_id)]
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