defmodule(Thrift.Hive.TColumnDesc) do
  _ = "Auto-generated Thrift struct TCLIService.TColumnDesc"
  _ = "1: string column_name"
  _ = "2: TCLIService.TTypeDesc type_desc"
  _ = "3: i32 position"
  _ = "4: string comment"
  defstruct(column_name: nil, type_desc: nil, position: nil, comment: nil)
  @type(t :: %__MODULE__{})
  def(new) do
    %__MODULE__{}
  end
  defmodule(BinaryProtocol) do
    @moduledoc(false)
    def(deserialize(binary)) do
      deserialize(binary, %Thrift.Hive.TColumnDesc{})
    end
    defp(deserialize(<<0, rest::binary>>, %Thrift.Hive.TColumnDesc{} = acc)) do
      {acc, rest}
    end
    defp(deserialize(<<11, 1::16-signed, string_size::32-signed, value::binary-size(string_size), rest::binary>>, acc)) do
      deserialize(rest, %{acc | column_name: value})
    end
    defp(deserialize(<<12, 2::16-signed, rest::binary>>, acc)) do
      case(Elixir.Thrift.Hive.TTypeDesc.BinaryProtocol.deserialize(rest)) do
        {value, rest} ->
          deserialize(rest, %{acc | type_desc: value})
        :error ->
          :error
      end
    end
    defp(deserialize(<<8, 3::16-signed, value::32-signed, rest::binary>>, acc)) do
      deserialize(rest, %{acc | position: value})
    end
    defp(deserialize(<<11, 4::16-signed, string_size::32-signed, value::binary-size(string_size), rest::binary>>, acc)) do
      deserialize(rest, %{acc | comment: value})
    end
    defp(deserialize(<<field_type, _id::16-signed, rest::binary>>, acc)) do
      rest |> Thrift.Protocol.Binary.skip_field(field_type) |> deserialize(acc)
    end
    defp(deserialize(_, _)) do
      :error
    end
    def(serialize(%Thrift.Hive.TColumnDesc{column_name: column_name, type_desc: type_desc, position: position, comment: comment})) do
      [case(column_name) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :column_name on Thrift.Hive.TColumnDesc must not be nil")
        _ ->
          [<<11, 1::16-signed, byte_size(column_name)::32-signed>> | column_name]
      end, case(type_desc) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :type_desc on Thrift.Hive.TColumnDesc must not be nil")
        _ ->
          [<<12, 2::16-signed>> | Thrift.Hive.TTypeDesc.serialize(type_desc)]
      end, case(position) do
        nil ->
          raise(Thrift.InvalidValueException, "Required field :position on Thrift.Hive.TColumnDesc must not be nil")
        _ ->
          <<8, 3::16-signed, position::32-signed>>
      end, case(comment) do
        nil ->
          <<>>
        _ ->
          [<<11, 4::16-signed, byte_size(comment)::32-signed>> | comment]
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