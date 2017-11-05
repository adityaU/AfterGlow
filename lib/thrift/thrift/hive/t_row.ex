defmodule(Thrift.Hive.TRow) do
  _ = "Auto-generated Thrift struct TCLIService.TRow"
  _ = "1: list<TCLIService.TColumnValue> col_vals"
  defstruct(col_vals: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TRow{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TRow{} = acc)) do
      {acc, rest}
    end
    defp(deserialize(<<15, 1::16-signed, 12, remaining::32-signed, rest::binary>>, struct)) do
      deserialize__col_vals(rest, [[], remaining, struct])
    end
    defp(deserialize(<<field_type, _id::16-signed, rest::binary>>, acc)) do
      rest |> Thrift.Protocol.Binary.skip_field(field_type) |> deserialize(acc)
    end
    defp(deserialize(_, _)) do
      :error
    end
    defp(deserialize__col_vals(<<rest::binary>>, [list, 0, struct])) do
      deserialize(rest, %{struct | col_vals: Enum.reverse(list)})
    end
    defp(deserialize__col_vals(<<rest::binary>>, [list, remaining | stack])) do
      case(Elixir.Thrift.Hive.TColumnValue.BinaryProtocol.deserialize(rest)) do
        {element, rest} ->
          deserialize__col_vals(rest, [[element | list], remaining - 1 | stack])
        :error ->
          :error
      end
    end
    defp(deserialize__col_vals(_, _)) do
      :error
    end
    def(serialize(%Thrift.Hive.TRow{col_vals: col_vals})) do
      [case(col_vals) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :col_vals on Thrift.Hive.TRow must not be nil")
        _ ->
          [<<15, 1::16-signed, 12, length(col_vals)::32-signed>> | for(e <- col_vals) do
            Thrift.Hive.TColumnValue.serialize(e)
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