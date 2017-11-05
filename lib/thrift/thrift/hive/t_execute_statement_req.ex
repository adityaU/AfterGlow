defmodule(Thrift.Hive.TExecuteStatementReq) do
  _ = "Auto-generated Thrift struct TCLIService.TExecuteStatementReq"
  _ = "1: TCLIService.TSessionHandle session_handle"
  _ = "2: string statement"
  _ = "3: map<string,string> conf_overlay"
  _ = "4: bool run_async"
  defstruct(session_handle: nil, statement: nil, conf_overlay: nil, run_async: false)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TExecuteStatementReq{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TExecuteStatementReq{} = acc)) do
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
    defp(deserialize(<<11, 2::16-signed, string_size::32-signed, value::binary-size(string_size), rest::binary>>, acc)) do
      deserialize(rest, %{acc | statement: value})
    end
    defp(deserialize(<<13, 3::16-signed, 11, 11, map_size::32-signed, rest::binary>>, struct)) do
      deserialize__conf_overlay__key(rest, [%{}, map_size, struct])
    end
    defp(deserialize(<<2, 4::16-signed, 1, rest::binary>>, acc)) do
      deserialize(rest, %{acc | run_async: true})
    end
    defp(deserialize(<<2, 4::16-signed, 0, rest::binary>>, acc)) do
      deserialize(rest, %{acc | run_async: false})
    end
    defp(deserialize(<<field_type, _id::16-signed, rest::binary>>, acc)) do
      rest |> Thrift.Protocol.Binary.skip_field(field_type) |> deserialize(acc)
    end
    defp(deserialize(_, _)) do
      :error
    end
    defp(deserialize__conf_overlay__key(<<rest::binary>>, [map, 0, struct])) do
      deserialize(rest, %{struct | conf_overlay: map})
    end
    defp(deserialize__conf_overlay__key(<<string_size::32-signed, key::binary-size(string_size), rest::binary>>, stack)) do
      deserialize__conf_overlay__value(rest, key, stack)
    end
    defp(deserialize__conf_overlay__key(_, _)) do
      :error
    end
    defp(deserialize__conf_overlay__value(<<string_size::32-signed, value::binary-size(string_size), rest::binary>>, key, [map, remaining | stack])) do
      deserialize__conf_overlay__key(rest, [Map.put(map, key, value), remaining - 1 | stack])
    end
    defp(deserialize__conf_overlay__value(_, _, _)) do
      :error
    end
    def(serialize(%Thrift.Hive.TExecuteStatementReq{session_handle: session_handle, statement: statement, conf_overlay: conf_overlay, run_async: run_async})) do
      [case(session_handle) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :session_handle on Thrift.Hive.TExecuteStatementReq must not be nil")
        _ ->
          [<<12, 1::16-signed>> | Thrift.Hive.TSessionHandle.serialize(session_handle)]
      end, case(statement) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :statement on Thrift.Hive.TExecuteStatementReq must not be nil")
        _ ->
          [<<11, 2::16-signed, byte_size(statement)::32-signed>> | statement]
      end, case(conf_overlay) do
        nil ->
          <<>>
        _ ->
          [<<13, 3::16-signed, 11, 11, Enum.count(conf_overlay)::32-signed>> | for({k, v} <- conf_overlay) do
            [<<byte_size(k)::32-signed>>, k, <<byte_size(v)::32-signed>> | v]
          end]
      end, case(run_async) do
        nil ->
          <<>>
        false ->
          <<2, 4::16-signed, 0>>
        true ->
          <<2, 4::16-signed, 1>>
        _ ->
          raise(Thrift.InvalidValueException, "Optional boolean field :run_async on Thrift.Hive.TExecuteStatementReq must be true, false, or nil")
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