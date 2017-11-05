defmodule(Thrift.Hive.TFetchResultsResp) do
  _ = "Auto-generated Thrift struct TCLIService.TFetchResultsResp"
  _ = "1: TCLIService.TStatus status"
  _ = "2: bool has_more_rows"
  _ = "3: TCLIService.TRowSet results"
  defstruct(status: nil, has_more_rows: nil, results: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TFetchResultsResp{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TFetchResultsResp{} = acc)) do
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
    defp(deserialize(<<2, 2::16-signed, 1, rest::binary>>, acc)) do
      deserialize(rest, %{acc | has_more_rows: true})
    end
    defp(deserialize(<<2, 2::16-signed, 0, rest::binary>>, acc)) do
      deserialize(rest, %{acc | has_more_rows: false})
    end
    defp(deserialize(<<12, 3::16-signed, rest::binary>>, acc)) do
      case(Elixir.Thrift.Hive.TRowSet.BinaryProtocol.deserialize(rest)) do
        {value, rest} ->
          deserialize(rest, %{acc | results: value})
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
    def(serialize(%Thrift.Hive.TFetchResultsResp{status: status, has_more_rows: has_more_rows, results: results})) do
      [case(status) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :status on Thrift.Hive.TFetchResultsResp must not be nil")
        _ ->
          [<<12, 1::16-signed>> | Thrift.Hive.TStatus.serialize(status)]
      end, case(has_more_rows) do
        nil ->
          <<>>
        false ->
          <<2, 2::16-signed, 0>>
        true ->
          <<2, 2::16-signed, 1>>
        _ ->
          raise(Thrift.InvalidValueException, "Optional boolean field :has_more_rows on Thrift.Hive.TFetchResultsResp must be true, false, or nil")
      end, case(results) do
        nil ->
          <<>>
        _ ->
          [<<12, 3::16-signed>> | Thrift.Hive.TRowSet.serialize(results)]
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