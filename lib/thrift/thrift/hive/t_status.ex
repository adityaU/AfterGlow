defmodule(Thrift.Hive.TStatus) do
  _ = "Auto-generated Thrift struct TCLIService.TStatus"
  _ = "1: TCLIService.TStatusCode status_code"
  _ = "2: list<string> info_messages"
  _ = "3: string sql_state"
  _ = "4: i32 error_code"
  _ = "5: string error_message"
  defstruct(status_code: nil, info_messages: nil, sql_state: nil, error_code: nil, error_message: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TStatus{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TStatus{} = acc)) do
      {acc, rest}
    end
    defp(deserialize(<<8, 1::16-signed, value::32-signed, rest::binary>>, acc)) do
      deserialize(rest, %{acc | status_code: value})
    end
    defp(deserialize(<<15, 2::16-signed, 11, remaining::32-signed, rest::binary>>, struct)) do
      deserialize__info_messages(rest, [[], remaining, struct])
    end
    defp(deserialize(<<11, 3::16-signed, string_size::32-signed, value::binary-size(string_size), rest::binary>>, acc)) do
      deserialize(rest, %{acc | sql_state: value})
    end
    defp(deserialize(<<8, 4::16-signed, value::32-signed, rest::binary>>, acc)) do
      deserialize(rest, %{acc | error_code: value})
    end
    defp(deserialize(<<11, 5::16-signed, string_size::32-signed, value::binary-size(string_size), rest::binary>>, acc)) do
      deserialize(rest, %{acc | error_message: value})
    end
    defp(deserialize(<<field_type, _id::16-signed, rest::binary>>, acc)) do
      rest |> Thrift.Protocol.Binary.skip_field(field_type) |> deserialize(acc)
    end
    defp(deserialize(_, _)) do
      :error
    end
    defp(deserialize__info_messages(<<rest::binary>>, [list, 0, struct])) do
      deserialize(rest, %{struct | info_messages: Enum.reverse(list)})
    end
    defp(deserialize__info_messages(<<string_size::32-signed, element::binary-size(string_size), rest::binary>>, [list, remaining | stack])) do
      deserialize__info_messages(rest, [[element | list], remaining - 1 | stack])
    end
    defp(deserialize__info_messages(_, _)) do
      :error
    end
    def(serialize(%Thrift.Hive.TStatus{status_code: status_code, info_messages: info_messages, sql_state: sql_state, error_code: error_code, error_message: error_message})) do
      [case(status_code) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :status_code on Thrift.Hive.TStatus must not be nil")
        _ ->
          <<8, 1::16-signed, status_code::32-signed>>
      end, case(info_messages) do
        nil ->
          <<>>
        _ ->
          [<<15, 2::16-signed, 11, length(info_messages)::32-signed>> | for(e <- info_messages) do
            [<<byte_size(e)::32-signed>> | e]
          end]
      end, case(sql_state) do
        nil ->
          <<>>
        _ ->
          [<<11, 3::16-signed, byte_size(sql_state)::32-signed>> | sql_state]
      end, case(error_code) do
        nil ->
          <<>>
        _ ->
          <<8, 4::16-signed, error_code::32-signed>>
      end, case(error_message) do
        nil ->
          <<>>
        _ ->
          [<<11, 5::16-signed, byte_size(error_message)::32-signed>> | error_message]
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