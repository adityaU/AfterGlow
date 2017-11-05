defmodule(Thrift.Hive.TByteColumn) do
  _ = "Auto-generated Thrift struct TCLIService.TByteColumn"
  _ = "1: list<i8> values"
  _ = "2: binary nulls"
  defstruct(values: nil, nulls: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TByteColumn{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TByteColumn{} = acc)) do
      {acc, rest}
    end
    defp(deserialize(<<15, 1::16-signed, 3, remaining::32-signed, rest::binary>>, struct)) do
      deserialize__values(rest, [[], remaining, struct])
    end
    defp(deserialize(<<11, 2::16-signed, string_size::32-signed, value::binary-size(string_size), rest::binary>>, acc)) do
      deserialize(rest, %{acc | nulls: value})
    end
    defp(deserialize(<<field_type, _id::16-signed, rest::binary>>, acc)) do
      rest |> Thrift.Protocol.Binary.skip_field(field_type) |> deserialize(acc)
    end
    defp(deserialize(_, _)) do
      :error
    end
    defp(deserialize__values(<<rest::binary>>, [list, 0, struct])) do
      deserialize(rest, %{struct | values: Enum.reverse(list)})
    end
    defp(deserialize__values(<<element::8-signed, rest::binary>>, [list, remaining | stack])) do
      deserialize__values(rest, [[element | list], remaining - 1 | stack])
    end
    defp(deserialize__values(_, _)) do
      :error
    end
    def(serialize(%Thrift.Hive.TByteColumn{values: values, nulls: nulls})) do
      [case(values) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :values on Thrift.Hive.TByteColumn must not be nil")
        _ ->
          [<<15, 1::16-signed, 3, length(values)::32-signed>> | for(e <- values) do
            <<e::8-signed>>
          end]
      end, case(nulls) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :nulls on Thrift.Hive.TByteColumn must not be nil")
        _ ->
          [<<11, 2::16-signed, byte_size(nulls)::32-signed>> | nulls]
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