defmodule(Thrift.Hive.TTableSchema) do
  _ = "Auto-generated Thrift struct TCLIService.TTableSchema"
  _ = "1: list<TCLIService.TColumnDesc> columns"
  defstruct(columns: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TTableSchema{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TTableSchema{} = acc)) do
      {acc, rest}
    end
    defp(deserialize(<<15, 1::16-signed, 12, remaining::32-signed, rest::binary>>, struct)) do
      deserialize__columns(rest, [[], remaining, struct])
    end
    defp(deserialize(<<field_type, _id::16-signed, rest::binary>>, acc)) do
      rest |> Thrift.Protocol.Binary.skip_field(field_type) |> deserialize(acc)
    end
    defp(deserialize(_, _)) do
      :error
    end
    defp(deserialize__columns(<<rest::binary>>, [list, 0, struct])) do
      deserialize(rest, %{struct | columns: Enum.reverse(list)})
    end
    defp(deserialize__columns(<<rest::binary>>, [list, remaining | stack])) do
      case(Elixir.Thrift.Hive.TColumnDesc.BinaryProtocol.deserialize(rest)) do
        {element, rest} ->
          deserialize__columns(rest, [[element | list], remaining - 1 | stack])
        :error ->
          :error
      end
    end
    defp(deserialize__columns(_, _)) do
      :error
    end
    def(serialize(%Thrift.Hive.TTableSchema{columns: columns})) do
      [case(columns) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :columns on Thrift.Hive.TTableSchema must not be nil")
        _ ->
          [<<15, 1::16-signed, 12, length(columns)::32-signed>> | for(e <- columns) do
            Thrift.Hive.TColumnDesc.serialize(e)
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