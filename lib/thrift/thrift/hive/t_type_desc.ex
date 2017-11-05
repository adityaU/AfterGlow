defmodule(Thrift.Hive.TTypeDesc) do
  _ = "Auto-generated Thrift struct TCLIService.TTypeDesc"
  _ = "1: list<TCLIService.TTypeEntry> types"
  defstruct(types: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TTypeDesc{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TTypeDesc{} = acc)) do
      {acc, rest}
    end
    defp(deserialize(<<15, 1::16-signed, 12, remaining::32-signed, rest::binary>>, struct)) do
      deserialize__types(rest, [[], remaining, struct])
    end
    defp(deserialize(<<field_type, _id::16-signed, rest::binary>>, acc)) do
      rest |> Thrift.Protocol.Binary.skip_field(field_type) |> deserialize(acc)
    end
    defp(deserialize(_, _)) do
      :error
    end
    defp(deserialize__types(<<rest::binary>>, [list, 0, struct])) do
      deserialize(rest, %{struct | types: Enum.reverse(list)})
    end
    defp(deserialize__types(<<rest::binary>>, [list, remaining | stack])) do
      case(Elixir.Thrift.Hive.TTypeEntry.BinaryProtocol.deserialize(rest)) do
        {element, rest} ->
          deserialize__types(rest, [[element | list], remaining - 1 | stack])
        :error ->
          :error
      end
    end
    defp(deserialize__types(_, _)) do
      :error
    end
    def(serialize(%Thrift.Hive.TTypeDesc{types: types})) do
      [case(types) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :types on Thrift.Hive.TTypeDesc must not be nil")
        _ ->
          [<<15, 1::16-signed, 12, length(types)::32-signed>> | for(e <- types) do
            Thrift.Hive.TTypeEntry.serialize(e)
          end]
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