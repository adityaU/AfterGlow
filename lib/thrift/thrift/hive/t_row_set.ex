defmodule(Thrift.Hive.TRowSet) do
  _ = "Auto-generated Thrift struct TCLIService.TRowSet"
  _ = "1: i64 start_row_offset"
  _ = "2: list<TCLIService.TRow> rows"
  _ = "3: list<TCLIService.TColumn> columns"
  defstruct(start_row_offset: nil, rows: nil, columns: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TRowSet{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TRowSet{} = acc)) do
      {acc, rest}
    end
    defp(deserialize(<<10, 1::16-signed, value::64-signed, rest::binary>>, acc)) do
      deserialize(rest, %{acc | start_row_offset: value})
    end
    defp(deserialize(<<15, 2::16-signed, 12, remaining::32-signed, rest::binary>>, struct)) do
      deserialize__rows(rest, [[], remaining, struct])
    end
    defp(deserialize(<<15, 3::16-signed, 12, remaining::32-signed, rest::binary>>, struct)) do
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
      case(Elixir.Thrift.Hive.TColumn.BinaryProtocol.deserialize(rest)) do
        {element, rest} ->
          deserialize__columns(rest, [[element | list], remaining - 1 | stack])
        :error ->
          :error
      end
    end
    defp(deserialize__columns(_, _)) do
      :error
    end
    defp(deserialize__rows(<<rest::binary>>, [list, 0, struct])) do
      deserialize(rest, %{struct | rows: Enum.reverse(list)})
    end
    defp(deserialize__rows(<<rest::binary>>, [list, remaining | stack])) do
      case(Elixir.Thrift.Hive.TRow.BinaryProtocol.deserialize(rest)) do
        {element, rest} ->
          deserialize__rows(rest, [[element | list], remaining - 1 | stack])
        :error ->
          :error
      end
    end
    defp(deserialize__rows(_, _)) do
      :error
    end
    def(serialize(%Thrift.Hive.TRowSet{start_row_offset: start_row_offset, rows: rows, columns: columns})) do
      [case(start_row_offset) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :start_row_offset on Thrift.Hive.TRowSet must not be nil")
        _ ->
          <<10, 1::16-signed, start_row_offset::64-signed>>
      end, case(rows) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :rows on Thrift.Hive.TRowSet must not be nil")
        _ ->
          [<<15, 2::16-signed, 12, length(rows)::32-signed>> | for(e <- rows) do
            Thrift.Hive.TRow.serialize(e)
          end]
      end, case(columns) do
        nil ->
          <<>>
        _ ->
          [<<15, 3::16-signed, 12, length(columns)::32-signed>> | for(e <- columns) do
            Thrift.Hive.TColumn.serialize(e)
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