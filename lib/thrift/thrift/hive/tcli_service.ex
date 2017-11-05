defmodule(Thrift.Hive.TCLIService) do
  defmacro(character_maximum_length) do
    Macro.escape("characterMaximumLength")
  end
  defmacro(collection_types) do
    Macro.escape(MapSet.new('\v\f'))
  end
  defmacro(complex_types) do
    Macro.escape(MapSet.new([11, 12, 13, 14, 15]))
  end
  defmacro(precision) do
    Macro.escape("precision")
  end
  defmacro(primitive_types) do
    Macro.escape(MapSet.new([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 16, 17, 18, 19, 20, 21, 22]))
  end
  defmacro(scale) do
    Macro.escape("scale")
  end
  defmacro(type_names) do
    Macro.escape(%{1 => "BOOLEAN", 2 => "TINYINT", 3 => "SMALLINT", 4 => "INT", 5 => "BIGINT", 6 => "FLOAT", 7 => "DOUBLE", 8 => "STRING", 9 => "TIMESTAMP", 10 => "BINARY", 11 => "ARRAY", 12 => "MAP", 13 => "STRUCT", 14 => "UNIONTYPE", 16 => "DECIMAL", 17 => "NULL", 18 => "DATE", 19 => "VARCHAR", 20 => "CHAR", 21 => "INTERVAL_YEAR_MONTH", 22 => "INTERVAL_DAY_TIME"})
  end
  defmodule(CancelDelegationTokenArgs) do
    _ = "Auto-generated Thrift struct Elixir.CancelDelegationTokenArgs"
    _ = "1: TCLIService.TCancelDelegationTokenReq req"
    defstruct(req: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %CancelDelegationTokenArgs{})
      end
      defp(deserialize(<<0, rest::binary>>, %CancelDelegationTokenArgs{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 1::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TCancelDelegationTokenReq.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | req: value})
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
      def(serialize(%CancelDelegationTokenArgs{req: req})) do
        [case(req) do
          nil ->
            <<>>
          _ ->
            [<<12, 1::16-signed>> | Thrift.Hive.TCancelDelegationTokenReq.serialize(req)]
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
  defmodule(CancelOperationArgs) do
    _ = "Auto-generated Thrift struct Elixir.CancelOperationArgs"
    _ = "1: TCLIService.TCancelOperationReq req"
    defstruct(req: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %CancelOperationArgs{})
      end
      defp(deserialize(<<0, rest::binary>>, %CancelOperationArgs{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 1::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TCancelOperationReq.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | req: value})
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
      def(serialize(%CancelOperationArgs{req: req})) do
        [case(req) do
          nil ->
            <<>>
          _ ->
            [<<12, 1::16-signed>> | Thrift.Hive.TCancelOperationReq.serialize(req)]
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
  defmodule(CloseOperationArgs) do
    _ = "Auto-generated Thrift struct Elixir.CloseOperationArgs"
    _ = "1: TCLIService.TCloseOperationReq req"
    defstruct(req: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %CloseOperationArgs{})
      end
      defp(deserialize(<<0, rest::binary>>, %CloseOperationArgs{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 1::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TCloseOperationReq.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | req: value})
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
      def(serialize(%CloseOperationArgs{req: req})) do
        [case(req) do
          nil ->
            <<>>
          _ ->
            [<<12, 1::16-signed>> | Thrift.Hive.TCloseOperationReq.serialize(req)]
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
  defmodule(CloseSessionArgs) do
    _ = "Auto-generated Thrift struct Elixir.CloseSessionArgs"
    _ = "1: TCLIService.TCloseSessionReq req"
    defstruct(req: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %CloseSessionArgs{})
      end
      defp(deserialize(<<0, rest::binary>>, %CloseSessionArgs{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 1::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TCloseSessionReq.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | req: value})
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
      def(serialize(%CloseSessionArgs{req: req})) do
        [case(req) do
          nil ->
            <<>>
          _ ->
            [<<12, 1::16-signed>> | Thrift.Hive.TCloseSessionReq.serialize(req)]
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
  defmodule(ExecuteStatementArgs) do
    _ = "Auto-generated Thrift struct Elixir.ExecuteStatementArgs"
    _ = "1: TCLIService.TExecuteStatementReq req"
    defstruct(req: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %ExecuteStatementArgs{})
      end
      defp(deserialize(<<0, rest::binary>>, %ExecuteStatementArgs{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 1::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TExecuteStatementReq.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | req: value})
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
      def(serialize(%ExecuteStatementArgs{req: req})) do
        [case(req) do
          nil ->
            <<>>
          _ ->
            [<<12, 1::16-signed>> | Thrift.Hive.TExecuteStatementReq.serialize(req)]
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
  defmodule(FetchResultsArgs) do
    _ = "Auto-generated Thrift struct Elixir.FetchResultsArgs"
    _ = "1: TCLIService.TFetchResultsReq req"
    defstruct(req: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %FetchResultsArgs{})
      end
      defp(deserialize(<<0, rest::binary>>, %FetchResultsArgs{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 1::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TFetchResultsReq.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | req: value})
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
      def(serialize(%FetchResultsArgs{req: req})) do
        [case(req) do
          nil ->
            <<>>
          _ ->
            [<<12, 1::16-signed>> | Thrift.Hive.TFetchResultsReq.serialize(req)]
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
  defmodule(GetCatalogsArgs) do
    _ = "Auto-generated Thrift struct Elixir.GetCatalogsArgs"
    _ = "1: TCLIService.TGetCatalogsReq req"
    defstruct(req: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %GetCatalogsArgs{})
      end
      defp(deserialize(<<0, rest::binary>>, %GetCatalogsArgs{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 1::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TGetCatalogsReq.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | req: value})
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
      def(serialize(%GetCatalogsArgs{req: req})) do
        [case(req) do
          nil ->
            <<>>
          _ ->
            [<<12, 1::16-signed>> | Thrift.Hive.TGetCatalogsReq.serialize(req)]
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
  defmodule(GetColumnsArgs) do
    _ = "Auto-generated Thrift struct Elixir.GetColumnsArgs"
    _ = "1: TCLIService.TGetColumnsReq req"
    defstruct(req: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %GetColumnsArgs{})
      end
      defp(deserialize(<<0, rest::binary>>, %GetColumnsArgs{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 1::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TGetColumnsReq.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | req: value})
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
      def(serialize(%GetColumnsArgs{req: req})) do
        [case(req) do
          nil ->
            <<>>
          _ ->
            [<<12, 1::16-signed>> | Thrift.Hive.TGetColumnsReq.serialize(req)]
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
  defmodule(GetDelegationTokenArgs) do
    _ = "Auto-generated Thrift struct Elixir.GetDelegationTokenArgs"
    _ = "1: TCLIService.TGetDelegationTokenReq req"
    defstruct(req: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %GetDelegationTokenArgs{})
      end
      defp(deserialize(<<0, rest::binary>>, %GetDelegationTokenArgs{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 1::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TGetDelegationTokenReq.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | req: value})
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
      def(serialize(%GetDelegationTokenArgs{req: req})) do
        [case(req) do
          nil ->
            <<>>
          _ ->
            [<<12, 1::16-signed>> | Thrift.Hive.TGetDelegationTokenReq.serialize(req)]
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
  defmodule(GetFunctionsArgs) do
    _ = "Auto-generated Thrift struct Elixir.GetFunctionsArgs"
    _ = "1: TCLIService.TGetFunctionsReq req"
    defstruct(req: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %GetFunctionsArgs{})
      end
      defp(deserialize(<<0, rest::binary>>, %GetFunctionsArgs{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 1::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TGetFunctionsReq.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | req: value})
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
      def(serialize(%GetFunctionsArgs{req: req})) do
        [case(req) do
          nil ->
            <<>>
          _ ->
            [<<12, 1::16-signed>> | Thrift.Hive.TGetFunctionsReq.serialize(req)]
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
  defmodule(GetInfoArgs) do
    _ = "Auto-generated Thrift struct Elixir.GetInfoArgs"
    _ = "1: TCLIService.TGetInfoReq req"
    defstruct(req: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %GetInfoArgs{})
      end
      defp(deserialize(<<0, rest::binary>>, %GetInfoArgs{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 1::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TGetInfoReq.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | req: value})
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
      def(serialize(%GetInfoArgs{req: req})) do
        [case(req) do
          nil ->
            <<>>
          _ ->
            [<<12, 1::16-signed>> | Thrift.Hive.TGetInfoReq.serialize(req)]
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
  defmodule(GetOperationStatusArgs) do
    _ = "Auto-generated Thrift struct Elixir.GetOperationStatusArgs"
    _ = "1: TCLIService.TGetOperationStatusReq req"
    defstruct(req: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %GetOperationStatusArgs{})
      end
      defp(deserialize(<<0, rest::binary>>, %GetOperationStatusArgs{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 1::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TGetOperationStatusReq.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | req: value})
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
      def(serialize(%GetOperationStatusArgs{req: req})) do
        [case(req) do
          nil ->
            <<>>
          _ ->
            [<<12, 1::16-signed>> | Thrift.Hive.TGetOperationStatusReq.serialize(req)]
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
  defmodule(GetResultSetMetadataArgs) do
    _ = "Auto-generated Thrift struct Elixir.GetResultSetMetadataArgs"
    _ = "1: TCLIService.TGetResultSetMetadataReq req"
    defstruct(req: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %GetResultSetMetadataArgs{})
      end
      defp(deserialize(<<0, rest::binary>>, %GetResultSetMetadataArgs{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 1::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TGetResultSetMetadataReq.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | req: value})
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
      def(serialize(%GetResultSetMetadataArgs{req: req})) do
        [case(req) do
          nil ->
            <<>>
          _ ->
            [<<12, 1::16-signed>> | Thrift.Hive.TGetResultSetMetadataReq.serialize(req)]
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
  defmodule(GetSchemasArgs) do
    _ = "Auto-generated Thrift struct Elixir.GetSchemasArgs"
    _ = "1: TCLIService.TGetSchemasReq req"
    defstruct(req: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %GetSchemasArgs{})
      end
      defp(deserialize(<<0, rest::binary>>, %GetSchemasArgs{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 1::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TGetSchemasReq.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | req: value})
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
      def(serialize(%GetSchemasArgs{req: req})) do
        [case(req) do
          nil ->
            <<>>
          _ ->
            [<<12, 1::16-signed>> | Thrift.Hive.TGetSchemasReq.serialize(req)]
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
  defmodule(GetTableTypesArgs) do
    _ = "Auto-generated Thrift struct Elixir.GetTableTypesArgs"
    _ = "1: TCLIService.TGetTableTypesReq req"
    defstruct(req: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %GetTableTypesArgs{})
      end
      defp(deserialize(<<0, rest::binary>>, %GetTableTypesArgs{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 1::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TGetTableTypesReq.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | req: value})
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
      def(serialize(%GetTableTypesArgs{req: req})) do
        [case(req) do
          nil ->
            <<>>
          _ ->
            [<<12, 1::16-signed>> | Thrift.Hive.TGetTableTypesReq.serialize(req)]
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
  defmodule(GetTablesArgs) do
    _ = "Auto-generated Thrift struct Elixir.GetTablesArgs"
    _ = "1: TCLIService.TGetTablesReq req"
    defstruct(req: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %GetTablesArgs{})
      end
      defp(deserialize(<<0, rest::binary>>, %GetTablesArgs{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 1::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TGetTablesReq.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | req: value})
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
      def(serialize(%GetTablesArgs{req: req})) do
        [case(req) do
          nil ->
            <<>>
          _ ->
            [<<12, 1::16-signed>> | Thrift.Hive.TGetTablesReq.serialize(req)]
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
  defmodule(GetTypeInfoArgs) do
    _ = "Auto-generated Thrift struct Elixir.GetTypeInfoArgs"
    _ = "1: TCLIService.TGetTypeInfoReq req"
    defstruct(req: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %GetTypeInfoArgs{})
      end
      defp(deserialize(<<0, rest::binary>>, %GetTypeInfoArgs{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 1::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TGetTypeInfoReq.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | req: value})
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
      def(serialize(%GetTypeInfoArgs{req: req})) do
        [case(req) do
          nil ->
            <<>>
          _ ->
            [<<12, 1::16-signed>> | Thrift.Hive.TGetTypeInfoReq.serialize(req)]
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
  defmodule(OpenSessionArgs) do
    _ = "Auto-generated Thrift struct Elixir.OpenSessionArgs"
    _ = "1: TCLIService.TOpenSessionReq req"
    defstruct(req: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %OpenSessionArgs{})
      end
      defp(deserialize(<<0, rest::binary>>, %OpenSessionArgs{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 1::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TOpenSessionReq.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | req: value})
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
      def(serialize(%OpenSessionArgs{req: req})) do
        [case(req) do
          nil ->
            <<>>
          _ ->
            [<<12, 1::16-signed>> | Thrift.Hive.TOpenSessionReq.serialize(req)]
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
  defmodule(RenewDelegationTokenArgs) do
    _ = "Auto-generated Thrift struct Elixir.RenewDelegationTokenArgs"
    _ = "1: TCLIService.TRenewDelegationTokenReq req"
    defstruct(req: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %RenewDelegationTokenArgs{})
      end
      defp(deserialize(<<0, rest::binary>>, %RenewDelegationTokenArgs{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 1::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TRenewDelegationTokenReq.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | req: value})
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
      def(serialize(%RenewDelegationTokenArgs{req: req})) do
        [case(req) do
          nil ->
            <<>>
          _ ->
            [<<12, 1::16-signed>> | Thrift.Hive.TRenewDelegationTokenReq.serialize(req)]
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
  defmodule(CancelDelegationTokenResponse) do
    _ = "Auto-generated Thrift struct Elixir.CancelDelegationTokenResponse"
    _ = "0: TCLIService.TCancelDelegationTokenResp success"
    defstruct(success: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %CancelDelegationTokenResponse{})
      end
      defp(deserialize(<<0, rest::binary>>, %CancelDelegationTokenResponse{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 0::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TCancelDelegationTokenResp.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | success: value})
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
      def(serialize(%CancelDelegationTokenResponse{success: success})) do
        [case(success) do
          nil ->
            <<>>
          _ ->
            [<<12, 0::16-signed>> | Thrift.Hive.TCancelDelegationTokenResp.serialize(success)]
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
  defmodule(CancelOperationResponse) do
    _ = "Auto-generated Thrift struct Elixir.CancelOperationResponse"
    _ = "0: TCLIService.TCancelOperationResp success"
    defstruct(success: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %CancelOperationResponse{})
      end
      defp(deserialize(<<0, rest::binary>>, %CancelOperationResponse{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 0::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TCancelOperationResp.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | success: value})
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
      def(serialize(%CancelOperationResponse{success: success})) do
        [case(success) do
          nil ->
            <<>>
          _ ->
            [<<12, 0::16-signed>> | Thrift.Hive.TCancelOperationResp.serialize(success)]
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
  defmodule(CloseOperationResponse) do
    _ = "Auto-generated Thrift struct Elixir.CloseOperationResponse"
    _ = "0: TCLIService.TCloseOperationResp success"
    defstruct(success: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %CloseOperationResponse{})
      end
      defp(deserialize(<<0, rest::binary>>, %CloseOperationResponse{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 0::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TCloseOperationResp.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | success: value})
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
      def(serialize(%CloseOperationResponse{success: success})) do
        [case(success) do
          nil ->
            <<>>
          _ ->
            [<<12, 0::16-signed>> | Thrift.Hive.TCloseOperationResp.serialize(success)]
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
  defmodule(CloseSessionResponse) do
    _ = "Auto-generated Thrift struct Elixir.CloseSessionResponse"
    _ = "0: TCLIService.TCloseSessionResp success"
    defstruct(success: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %CloseSessionResponse{})
      end
      defp(deserialize(<<0, rest::binary>>, %CloseSessionResponse{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 0::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TCloseSessionResp.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | success: value})
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
      def(serialize(%CloseSessionResponse{success: success})) do
        [case(success) do
          nil ->
            <<>>
          _ ->
            [<<12, 0::16-signed>> | Thrift.Hive.TCloseSessionResp.serialize(success)]
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
  defmodule(ExecuteStatementResponse) do
    _ = "Auto-generated Thrift struct Elixir.ExecuteStatementResponse"
    _ = "0: TCLIService.TExecuteStatementResp success"
    defstruct(success: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %ExecuteStatementResponse{})
      end
      defp(deserialize(<<0, rest::binary>>, %ExecuteStatementResponse{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 0::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TExecuteStatementResp.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | success: value})
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
      def(serialize(%ExecuteStatementResponse{success: success})) do
        [case(success) do
          nil ->
            <<>>
          _ ->
            [<<12, 0::16-signed>> | Thrift.Hive.TExecuteStatementResp.serialize(success)]
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
  defmodule(FetchResultsResponse) do
    _ = "Auto-generated Thrift struct Elixir.FetchResultsResponse"
    _ = "0: TCLIService.TFetchResultsResp success"
    defstruct(success: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %FetchResultsResponse{})
      end
      defp(deserialize(<<0, rest::binary>>, %FetchResultsResponse{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 0::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TFetchResultsResp.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | success: value})
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
      def(serialize(%FetchResultsResponse{success: success})) do
        [case(success) do
          nil ->
            <<>>
          _ ->
            [<<12, 0::16-signed>> | Thrift.Hive.TFetchResultsResp.serialize(success)]
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
  defmodule(GetCatalogsResponse) do
    _ = "Auto-generated Thrift struct Elixir.GetCatalogsResponse"
    _ = "0: TCLIService.TGetCatalogsResp success"
    defstruct(success: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %GetCatalogsResponse{})
      end
      defp(deserialize(<<0, rest::binary>>, %GetCatalogsResponse{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 0::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TGetCatalogsResp.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | success: value})
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
      def(serialize(%GetCatalogsResponse{success: success})) do
        [case(success) do
          nil ->
            <<>>
          _ ->
            [<<12, 0::16-signed>> | Thrift.Hive.TGetCatalogsResp.serialize(success)]
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
  defmodule(GetColumnsResponse) do
    _ = "Auto-generated Thrift struct Elixir.GetColumnsResponse"
    _ = "0: TCLIService.TGetColumnsResp success"
    defstruct(success: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %GetColumnsResponse{})
      end
      defp(deserialize(<<0, rest::binary>>, %GetColumnsResponse{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 0::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TGetColumnsResp.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | success: value})
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
      def(serialize(%GetColumnsResponse{success: success})) do
        [case(success) do
          nil ->
            <<>>
          _ ->
            [<<12, 0::16-signed>> | Thrift.Hive.TGetColumnsResp.serialize(success)]
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
  defmodule(GetDelegationTokenResponse) do
    _ = "Auto-generated Thrift struct Elixir.GetDelegationTokenResponse"
    _ = "0: TCLIService.TGetDelegationTokenResp success"
    defstruct(success: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %GetDelegationTokenResponse{})
      end
      defp(deserialize(<<0, rest::binary>>, %GetDelegationTokenResponse{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 0::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TGetDelegationTokenResp.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | success: value})
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
      def(serialize(%GetDelegationTokenResponse{success: success})) do
        [case(success) do
          nil ->
            <<>>
          _ ->
            [<<12, 0::16-signed>> | Thrift.Hive.TGetDelegationTokenResp.serialize(success)]
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
  defmodule(GetFunctionsResponse) do
    _ = "Auto-generated Thrift struct Elixir.GetFunctionsResponse"
    _ = "0: TCLIService.TGetFunctionsResp success"
    defstruct(success: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %GetFunctionsResponse{})
      end
      defp(deserialize(<<0, rest::binary>>, %GetFunctionsResponse{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 0::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TGetFunctionsResp.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | success: value})
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
      def(serialize(%GetFunctionsResponse{success: success})) do
        [case(success) do
          nil ->
            <<>>
          _ ->
            [<<12, 0::16-signed>> | Thrift.Hive.TGetFunctionsResp.serialize(success)]
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
  defmodule(GetInfoResponse) do
    _ = "Auto-generated Thrift struct Elixir.GetInfoResponse"
    _ = "0: TCLIService.TGetInfoResp success"
    defstruct(success: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %GetInfoResponse{})
      end
      defp(deserialize(<<0, rest::binary>>, %GetInfoResponse{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 0::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TGetInfoResp.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | success: value})
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
      def(serialize(%GetInfoResponse{success: success})) do
        [case(success) do
          nil ->
            <<>>
          _ ->
            [<<12, 0::16-signed>> | Thrift.Hive.TGetInfoResp.serialize(success)]
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
  defmodule(GetOperationStatusResponse) do
    _ = "Auto-generated Thrift struct Elixir.GetOperationStatusResponse"
    _ = "0: TCLIService.TGetOperationStatusResp success"
    defstruct(success: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %GetOperationStatusResponse{})
      end
      defp(deserialize(<<0, rest::binary>>, %GetOperationStatusResponse{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 0::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TGetOperationStatusResp.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | success: value})
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
      def(serialize(%GetOperationStatusResponse{success: success})) do
        [case(success) do
          nil ->
            <<>>
          _ ->
            [<<12, 0::16-signed>> | Thrift.Hive.TGetOperationStatusResp.serialize(success)]
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
  defmodule(GetResultSetMetadataResponse) do
    _ = "Auto-generated Thrift struct Elixir.GetResultSetMetadataResponse"
    _ = "0: TCLIService.TGetResultSetMetadataResp success"
    defstruct(success: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %GetResultSetMetadataResponse{})
      end
      defp(deserialize(<<0, rest::binary>>, %GetResultSetMetadataResponse{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 0::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TGetResultSetMetadataResp.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | success: value})
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
      def(serialize(%GetResultSetMetadataResponse{success: success})) do
        [case(success) do
          nil ->
            <<>>
          _ ->
            [<<12, 0::16-signed>> | Thrift.Hive.TGetResultSetMetadataResp.serialize(success)]
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
  defmodule(GetSchemasResponse) do
    _ = "Auto-generated Thrift struct Elixir.GetSchemasResponse"
    _ = "0: TCLIService.TGetSchemasResp success"
    defstruct(success: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %GetSchemasResponse{})
      end
      defp(deserialize(<<0, rest::binary>>, %GetSchemasResponse{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 0::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TGetSchemasResp.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | success: value})
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
      def(serialize(%GetSchemasResponse{success: success})) do
        [case(success) do
          nil ->
            <<>>
          _ ->
            [<<12, 0::16-signed>> | Thrift.Hive.TGetSchemasResp.serialize(success)]
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
  defmodule(GetTableTypesResponse) do
    _ = "Auto-generated Thrift struct Elixir.GetTableTypesResponse"
    _ = "0: TCLIService.TGetTableTypesResp success"
    defstruct(success: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %GetTableTypesResponse{})
      end
      defp(deserialize(<<0, rest::binary>>, %GetTableTypesResponse{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 0::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TGetTableTypesResp.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | success: value})
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
      def(serialize(%GetTableTypesResponse{success: success})) do
        [case(success) do
          nil ->
            <<>>
          _ ->
            [<<12, 0::16-signed>> | Thrift.Hive.TGetTableTypesResp.serialize(success)]
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
  defmodule(GetTablesResponse) do
    _ = "Auto-generated Thrift struct Elixir.GetTablesResponse"
    _ = "0: TCLIService.TGetTablesResp success"
    defstruct(success: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %GetTablesResponse{})
      end
      defp(deserialize(<<0, rest::binary>>, %GetTablesResponse{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 0::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TGetTablesResp.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | success: value})
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
      def(serialize(%GetTablesResponse{success: success})) do
        [case(success) do
          nil ->
            <<>>
          _ ->
            [<<12, 0::16-signed>> | Thrift.Hive.TGetTablesResp.serialize(success)]
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
  defmodule(GetTypeInfoResponse) do
    _ = "Auto-generated Thrift struct Elixir.GetTypeInfoResponse"
    _ = "0: TCLIService.TGetTypeInfoResp success"
    defstruct(success: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %GetTypeInfoResponse{})
      end
      defp(deserialize(<<0, rest::binary>>, %GetTypeInfoResponse{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 0::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TGetTypeInfoResp.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | success: value})
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
      def(serialize(%GetTypeInfoResponse{success: success})) do
        [case(success) do
          nil ->
            <<>>
          _ ->
            [<<12, 0::16-signed>> | Thrift.Hive.TGetTypeInfoResp.serialize(success)]
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
  defmodule(OpenSessionResponse) do
    _ = "Auto-generated Thrift struct Elixir.OpenSessionResponse"
    _ = "0: TCLIService.TOpenSessionResp success"
    defstruct(success: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %OpenSessionResponse{})
      end
      defp(deserialize(<<0, rest::binary>>, %OpenSessionResponse{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 0::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TOpenSessionResp.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | success: value})
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
      def(serialize(%OpenSessionResponse{success: success})) do
        [case(success) do
          nil ->
            <<>>
          _ ->
            [<<12, 0::16-signed>> | Thrift.Hive.TOpenSessionResp.serialize(success)]
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
  defmodule(RenewDelegationTokenResponse) do
    _ = "Auto-generated Thrift struct Elixir.RenewDelegationTokenResponse"
    _ = "0: TCLIService.TRenewDelegationTokenResp success"
    defstruct(success: nil)
    @type(t :: %__MODULE__{})
    def(new) do
      %__MODULE__{}
    end
    defmodule(BinaryProtocol) do
      @moduledoc(false)
      def(deserialize(binary)) do
        deserialize(binary, %RenewDelegationTokenResponse{})
      end
      defp(deserialize(<<0, rest::binary>>, %RenewDelegationTokenResponse{} = acc)) do
        {acc, rest}
      end
      defp(deserialize(<<12, 0::16-signed, rest::binary>>, acc)) do
        case(Elixir.Thrift.Hive.TRenewDelegationTokenResp.BinaryProtocol.deserialize(rest)) do
          {value, rest} ->
            deserialize(rest, %{acc | success: value})
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
      def(serialize(%RenewDelegationTokenResponse{success: success})) do
        [case(success) do
          nil ->
            <<>>
          _ ->
            [<<12, 0::16-signed>> | Thrift.Hive.TRenewDelegationTokenResp.serialize(success)]
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
  defmodule(Binary.Framed.Client) do
    @moduledoc(false)
    alias(Thrift.Binary.Framed.Client, as: ClientImpl)
    defdelegate(close(conn), to: ClientImpl)
    defdelegate(connect(conn, opts), to: ClientImpl)
    def(start_link(host, port, opts \\ [])) do
      ClientImpl.start_link(host, port, opts)
    end
    def(cancel_delegation_token_with_options(client, req, opts)) do
      args = %Thrift.Hive.TCLIService.CancelDelegationTokenArgs{req: req}
      serialized_args = Elixir.Thrift.Hive.TCLIService.CancelDelegationTokenArgs.BinaryProtocol.serialize(args)
      (
        deserialize_module = CancelDelegationTokenResponse.BinaryProtocol
        rpc_name = "CancelDelegationToken"
        ClientImpl.call(client, rpc_name, serialized_args, deserialize_module, opts)
      )
    end
    def(cancel_delegation_token(client, req)) do
      cancel_delegation_token_with_options(client, req, [])
    end
    def(cancel_delegation_token_with_options!(client, req, opts)) do
      case(cancel_delegation_token_with_options(client, req, opts)) do
        {:ok, rsp} ->
          rsp
        {:error, {:exception, ex}} ->
          raise(ex)
        {:error, _} = err ->
          raise(err)
      end
    end
    def(cancel_delegation_token!(client, req)) do
      cancel_delegation_token_with_options!(client, req, [])
    end
    def(cancel_operation_with_options(client, req, opts)) do
      args = %Thrift.Hive.TCLIService.CancelOperationArgs{req: req}
      serialized_args = Elixir.Thrift.Hive.TCLIService.CancelOperationArgs.BinaryProtocol.serialize(args)
      (
        deserialize_module = CancelOperationResponse.BinaryProtocol
        rpc_name = "CancelOperation"
        ClientImpl.call(client, rpc_name, serialized_args, deserialize_module, opts)
      )
    end
    def(cancel_operation(client, req)) do
      cancel_operation_with_options(client, req, [])
    end
    def(cancel_operation_with_options!(client, req, opts)) do
      case(cancel_operation_with_options(client, req, opts)) do
        {:ok, rsp} ->
          rsp
        {:error, {:exception, ex}} ->
          raise(ex)
        {:error, _} = err ->
          raise(err)
      end
    end
    def(cancel_operation!(client, req)) do
      cancel_operation_with_options!(client, req, [])
    end
    def(close_operation_with_options(client, req, opts)) do
      args = %Thrift.Hive.TCLIService.CloseOperationArgs{req: req}
      serialized_args = Elixir.Thrift.Hive.TCLIService.CloseOperationArgs.BinaryProtocol.serialize(args)
      (
        deserialize_module = CloseOperationResponse.BinaryProtocol
        rpc_name = "CloseOperation"
        ClientImpl.call(client, rpc_name, serialized_args, deserialize_module, opts)
      )
    end
    def(close_operation(client, req)) do
      close_operation_with_options(client, req, [])
    end
    def(close_operation_with_options!(client, req, opts)) do
      case(close_operation_with_options(client, req, opts)) do
        {:ok, rsp} ->
          rsp
        {:error, {:exception, ex}} ->
          raise(ex)
        {:error, _} = err ->
          raise(err)
      end
    end
    def(close_operation!(client, req)) do
      close_operation_with_options!(client, req, [])
    end
    def(close_session_with_options(client, req, opts)) do
      args = %Thrift.Hive.TCLIService.CloseSessionArgs{req: req}
      serialized_args = Elixir.Thrift.Hive.TCLIService.CloseSessionArgs.BinaryProtocol.serialize(args)
      (
        deserialize_module = CloseSessionResponse.BinaryProtocol
        rpc_name = "CloseSession"
        ClientImpl.call(client, rpc_name, serialized_args, deserialize_module, opts)
      )
    end
    def(close_session(client, req)) do
      close_session_with_options(client, req, [])
    end
    def(close_session_with_options!(client, req, opts)) do
      case(close_session_with_options(client, req, opts)) do
        {:ok, rsp} ->
          rsp
        {:error, {:exception, ex}} ->
          raise(ex)
        {:error, _} = err ->
          raise(err)
      end
    end
    def(close_session!(client, req)) do
      close_session_with_options!(client, req, [])
    end
    def(execute_statement_with_options(client, req, opts)) do
      args = %Thrift.Hive.TCLIService.ExecuteStatementArgs{req: req}
      serialized_args = Elixir.Thrift.Hive.TCLIService.ExecuteStatementArgs.BinaryProtocol.serialize(args)
      (
        deserialize_module = ExecuteStatementResponse.BinaryProtocol
        rpc_name = "ExecuteStatement"
        ClientImpl.call(client, rpc_name, serialized_args, deserialize_module, opts)
      )
    end
    def(execute_statement(client, req)) do
      execute_statement_with_options(client, req, [])
    end
    def(execute_statement_with_options!(client, req, opts)) do
      case(execute_statement_with_options(client, req, opts)) do
        {:ok, rsp} ->
          rsp
        {:error, {:exception, ex}} ->
          raise(ex)
        {:error, _} = err ->
          raise(err)
      end
    end
    def(execute_statement!(client, req)) do
      execute_statement_with_options!(client, req, [])
    end
    def(fetch_results_with_options(client, req, opts)) do
      args = %Thrift.Hive.TCLIService.FetchResultsArgs{req: req}
      serialized_args = Elixir.Thrift.Hive.TCLIService.FetchResultsArgs.BinaryProtocol.serialize(args)
      (
        deserialize_module = FetchResultsResponse.BinaryProtocol
        rpc_name = "FetchResults"
        ClientImpl.call(client, rpc_name, serialized_args, deserialize_module, opts)
      )
    end
    def(fetch_results(client, req)) do
      fetch_results_with_options(client, req, [])
    end
    def(fetch_results_with_options!(client, req, opts)) do
      case(fetch_results_with_options(client, req, opts)) do
        {:ok, rsp} ->
          rsp
        {:error, {:exception, ex}} ->
          raise(ex)
        {:error, _} = err ->
          raise(err)
      end
    end
    def(fetch_results!(client, req)) do
      fetch_results_with_options!(client, req, [])
    end
    def(get_catalogs_with_options(client, req, opts)) do
      args = %Thrift.Hive.TCLIService.GetCatalogsArgs{req: req}
      serialized_args = Elixir.Thrift.Hive.TCLIService.GetCatalogsArgs.BinaryProtocol.serialize(args)
      (
        deserialize_module = GetCatalogsResponse.BinaryProtocol
        rpc_name = "GetCatalogs"
        ClientImpl.call(client, rpc_name, serialized_args, deserialize_module, opts)
      )
    end
    def(get_catalogs(client, req)) do
      get_catalogs_with_options(client, req, [])
    end
    def(get_catalogs_with_options!(client, req, opts)) do
      case(get_catalogs_with_options(client, req, opts)) do
        {:ok, rsp} ->
          rsp
        {:error, {:exception, ex}} ->
          raise(ex)
        {:error, _} = err ->
          raise(err)
      end
    end
    def(get_catalogs!(client, req)) do
      get_catalogs_with_options!(client, req, [])
    end
    def(get_columns_with_options(client, req, opts)) do
      args = %Thrift.Hive.TCLIService.GetColumnsArgs{req: req}
      serialized_args = Elixir.Thrift.Hive.TCLIService.GetColumnsArgs.BinaryProtocol.serialize(args)
      (
        deserialize_module = GetColumnsResponse.BinaryProtocol
        rpc_name = "GetColumns"
        ClientImpl.call(client, rpc_name, serialized_args, deserialize_module, opts)
      )
    end
    def(get_columns(client, req)) do
      get_columns_with_options(client, req, [])
    end
    def(get_columns_with_options!(client, req, opts)) do
      case(get_columns_with_options(client, req, opts)) do
        {:ok, rsp} ->
          rsp
        {:error, {:exception, ex}} ->
          raise(ex)
        {:error, _} = err ->
          raise(err)
      end
    end
    def(get_columns!(client, req)) do
      get_columns_with_options!(client, req, [])
    end
    def(get_delegation_token_with_options(client, req, opts)) do
      args = %Thrift.Hive.TCLIService.GetDelegationTokenArgs{req: req}
      serialized_args = Elixir.Thrift.Hive.TCLIService.GetDelegationTokenArgs.BinaryProtocol.serialize(args)
      (
        deserialize_module = GetDelegationTokenResponse.BinaryProtocol
        rpc_name = "GetDelegationToken"
        ClientImpl.call(client, rpc_name, serialized_args, deserialize_module, opts)
      )
    end
    def(get_delegation_token(client, req)) do
      get_delegation_token_with_options(client, req, [])
    end
    def(get_delegation_token_with_options!(client, req, opts)) do
      case(get_delegation_token_with_options(client, req, opts)) do
        {:ok, rsp} ->
          rsp
        {:error, {:exception, ex}} ->
          raise(ex)
        {:error, _} = err ->
          raise(err)
      end
    end
    def(get_delegation_token!(client, req)) do
      get_delegation_token_with_options!(client, req, [])
    end
    def(get_functions_with_options(client, req, opts)) do
      args = %Thrift.Hive.TCLIService.GetFunctionsArgs{req: req}
      serialized_args = Elixir.Thrift.Hive.TCLIService.GetFunctionsArgs.BinaryProtocol.serialize(args)
      (
        deserialize_module = GetFunctionsResponse.BinaryProtocol
        rpc_name = "GetFunctions"
        ClientImpl.call(client, rpc_name, serialized_args, deserialize_module, opts)
      )
    end
    def(get_functions(client, req)) do
      get_functions_with_options(client, req, [])
    end
    def(get_functions_with_options!(client, req, opts)) do
      case(get_functions_with_options(client, req, opts)) do
        {:ok, rsp} ->
          rsp
        {:error, {:exception, ex}} ->
          raise(ex)
        {:error, _} = err ->
          raise(err)
      end
    end
    def(get_functions!(client, req)) do
      get_functions_with_options!(client, req, [])
    end
    def(get_info_with_options(client, req, opts)) do
      args = %Thrift.Hive.TCLIService.GetInfoArgs{req: req}
      serialized_args = Elixir.Thrift.Hive.TCLIService.GetInfoArgs.BinaryProtocol.serialize(args)
      (
        deserialize_module = GetInfoResponse.BinaryProtocol
        rpc_name = "GetInfo"
        ClientImpl.call(client, rpc_name, serialized_args, deserialize_module, opts)
      )
    end
    def(get_info(client, req)) do
      get_info_with_options(client, req, [])
    end
    def(get_info_with_options!(client, req, opts)) do
      case(get_info_with_options(client, req, opts)) do
        {:ok, rsp} ->
          rsp
        {:error, {:exception, ex}} ->
          raise(ex)
        {:error, _} = err ->
          raise(err)
      end
    end
    def(get_info!(client, req)) do
      get_info_with_options!(client, req, [])
    end
    def(get_operation_status_with_options(client, req, opts)) do
      args = %Thrift.Hive.TCLIService.GetOperationStatusArgs{req: req}
      serialized_args = Elixir.Thrift.Hive.TCLIService.GetOperationStatusArgs.BinaryProtocol.serialize(args)
      (
        deserialize_module = GetOperationStatusResponse.BinaryProtocol
        rpc_name = "GetOperationStatus"
        ClientImpl.call(client, rpc_name, serialized_args, deserialize_module, opts)
      )
    end
    def(get_operation_status(client, req)) do
      get_operation_status_with_options(client, req, [])
    end
    def(get_operation_status_with_options!(client, req, opts)) do
      case(get_operation_status_with_options(client, req, opts)) do
        {:ok, rsp} ->
          rsp
        {:error, {:exception, ex}} ->
          raise(ex)
        {:error, _} = err ->
          raise(err)
      end
    end
    def(get_operation_status!(client, req)) do
      get_operation_status_with_options!(client, req, [])
    end
    def(get_result_set_metadata_with_options(client, req, opts)) do
      args = %Thrift.Hive.TCLIService.GetResultSetMetadataArgs{req: req}
      serialized_args = Elixir.Thrift.Hive.TCLIService.GetResultSetMetadataArgs.BinaryProtocol.serialize(args)
      (
        deserialize_module = GetResultSetMetadataResponse.BinaryProtocol
        rpc_name = "GetResultSetMetadata"
        ClientImpl.call(client, rpc_name, serialized_args, deserialize_module, opts)
      )
    end
    def(get_result_set_metadata(client, req)) do
      get_result_set_metadata_with_options(client, req, [])
    end
    def(get_result_set_metadata_with_options!(client, req, opts)) do
      case(get_result_set_metadata_with_options(client, req, opts)) do
        {:ok, rsp} ->
          rsp
        {:error, {:exception, ex}} ->
          raise(ex)
        {:error, _} = err ->
          raise(err)
      end
    end
    def(get_result_set_metadata!(client, req)) do
      get_result_set_metadata_with_options!(client, req, [])
    end
    def(get_schemas_with_options(client, req, opts)) do
      args = %Thrift.Hive.TCLIService.GetSchemasArgs{req: req}
      serialized_args = Elixir.Thrift.Hive.TCLIService.GetSchemasArgs.BinaryProtocol.serialize(args)
      (
        deserialize_module = GetSchemasResponse.BinaryProtocol
        rpc_name = "GetSchemas"
        ClientImpl.call(client, rpc_name, serialized_args, deserialize_module, opts)
      )
    end
    def(get_schemas(client, req)) do
      get_schemas_with_options(client, req, [])
    end
    def(get_schemas_with_options!(client, req, opts)) do
      case(get_schemas_with_options(client, req, opts)) do
        {:ok, rsp} ->
          rsp
        {:error, {:exception, ex}} ->
          raise(ex)
        {:error, _} = err ->
          raise(err)
      end
    end
    def(get_schemas!(client, req)) do
      get_schemas_with_options!(client, req, [])
    end
    def(get_table_types_with_options(client, req, opts)) do
      args = %Thrift.Hive.TCLIService.GetTableTypesArgs{req: req}
      serialized_args = Elixir.Thrift.Hive.TCLIService.GetTableTypesArgs.BinaryProtocol.serialize(args)
      (
        deserialize_module = GetTableTypesResponse.BinaryProtocol
        rpc_name = "GetTableTypes"
        ClientImpl.call(client, rpc_name, serialized_args, deserialize_module, opts)
      )
    end
    def(get_table_types(client, req)) do
      get_table_types_with_options(client, req, [])
    end
    def(get_table_types_with_options!(client, req, opts)) do
      case(get_table_types_with_options(client, req, opts)) do
        {:ok, rsp} ->
          rsp
        {:error, {:exception, ex}} ->
          raise(ex)
        {:error, _} = err ->
          raise(err)
      end
    end
    def(get_table_types!(client, req)) do
      get_table_types_with_options!(client, req, [])
    end
    def(get_tables_with_options(client, req, opts)) do
      args = %Thrift.Hive.TCLIService.GetTablesArgs{req: req}
      serialized_args = Elixir.Thrift.Hive.TCLIService.GetTablesArgs.BinaryProtocol.serialize(args)
      (
        deserialize_module = GetTablesResponse.BinaryProtocol
        rpc_name = "GetTables"
        ClientImpl.call(client, rpc_name, serialized_args, deserialize_module, opts)
      )
    end
    def(get_tables(client, req)) do
      get_tables_with_options(client, req, [])
    end
    def(get_tables_with_options!(client, req, opts)) do
      case(get_tables_with_options(client, req, opts)) do
        {:ok, rsp} ->
          rsp
        {:error, {:exception, ex}} ->
          raise(ex)
        {:error, _} = err ->
          raise(err)
      end
    end
    def(get_tables!(client, req)) do
      get_tables_with_options!(client, req, [])
    end
    def(get_type_info_with_options(client, req, opts)) do
      args = %Thrift.Hive.TCLIService.GetTypeInfoArgs{req: req}
      serialized_args = Elixir.Thrift.Hive.TCLIService.GetTypeInfoArgs.BinaryProtocol.serialize(args)
      (
        deserialize_module = GetTypeInfoResponse.BinaryProtocol
        rpc_name = "GetTypeInfo"
        ClientImpl.call(client, rpc_name, serialized_args, deserialize_module, opts)
      )
    end
    def(get_type_info(client, req)) do
      get_type_info_with_options(client, req, [])
    end
    def(get_type_info_with_options!(client, req, opts)) do
      case(get_type_info_with_options(client, req, opts)) do
        {:ok, rsp} ->
          rsp
        {:error, {:exception, ex}} ->
          raise(ex)
        {:error, _} = err ->
          raise(err)
      end
    end
    def(get_type_info!(client, req)) do
      get_type_info_with_options!(client, req, [])
    end
    def(open_session_with_options(client, req, opts)) do
      args = %Thrift.Hive.TCLIService.OpenSessionArgs{req: req}
      serialized_args = Elixir.Thrift.Hive.TCLIService.OpenSessionArgs.BinaryProtocol.serialize(args)
      (
        deserialize_module = OpenSessionResponse.BinaryProtocol
        rpc_name = "OpenSession"
        ClientImpl.call(client, rpc_name, serialized_args, deserialize_module, opts)
      )
    end
    def(open_session(client, req)) do
      open_session_with_options(client, req, [])
    end
    def(open_session_with_options!(client, req, opts)) do
      case(open_session_with_options(client, req, opts)) do
        {:ok, rsp} ->
          rsp
        {:error, {:exception, ex}} ->
          raise(ex)
        {:error, _} = err ->
          raise(err)
      end
    end
    def(open_session!(client, req)) do
      open_session_with_options!(client, req, [])
    end
    def(renew_delegation_token_with_options(client, req, opts)) do
      args = %Thrift.Hive.TCLIService.RenewDelegationTokenArgs{req: req}
      serialized_args = Elixir.Thrift.Hive.TCLIService.RenewDelegationTokenArgs.BinaryProtocol.serialize(args)
      (
        deserialize_module = RenewDelegationTokenResponse.BinaryProtocol
        rpc_name = "RenewDelegationToken"
        ClientImpl.call(client, rpc_name, serialized_args, deserialize_module, opts)
      )
    end
    def(renew_delegation_token(client, req)) do
      renew_delegation_token_with_options(client, req, [])
    end
    def(renew_delegation_token_with_options!(client, req, opts)) do
      case(renew_delegation_token_with_options(client, req, opts)) do
        {:ok, rsp} ->
          rsp
        {:error, {:exception, ex}} ->
          raise(ex)
        {:error, _} = err ->
          raise(err)
      end
    end
    def(renew_delegation_token!(client, req)) do
      renew_delegation_token_with_options!(client, req, [])
    end
  end
  defmodule(Binary.Framed.Server) do
    @moduledoc(false)
    require(Logger)
    alias(Thrift.Binary.Framed.Server, as: ServerImpl)
    defdelegate(stop(name), to: ServerImpl)
    def(start_link(handler_module, port, opts \\ [])) do
      ServerImpl.start_link(__MODULE__, port, handler_module, opts)
    end
    def(handle_thrift("CancelDelegationToken", binary_data, handler_module)) do
      case(Elixir.Thrift.Hive.TCLIService.CancelDelegationTokenArgs.BinaryProtocol.deserialize(binary_data)) do
        {%Thrift.Hive.TCLIService.CancelDelegationTokenArgs{req: req}, ""} ->
          try() do
            rsp = handler_module.cancel_delegation_token(req)
            (
              response = %Thrift.Hive.TCLIService.CancelDelegationTokenResponse{success: rsp}
              {:reply, Elixir.Thrift.Hive.TCLIService.CancelDelegationTokenResponse.BinaryProtocol.serialize(response)}
            )
          catch
            kind, reason ->
              formatted_exception = Exception.format(kind, reason, System.stacktrace())
              Logger.error("Exception not defined in thrift spec was thrown: #{formatted_exception}")
              error = Thrift.TApplicationException.exception(type: :internal_error, message: "Server error: #{formatted_exception}")
              {:server_error, error}
          rescue
            []
          end
        {_, extra} ->
          raise(Thrift.TApplicationException, type: :protocol_error, message: "Could not decode #{inspect(extra)}")
      end
    end
    def(handle_thrift("CancelOperation", binary_data, handler_module)) do
      case(Elixir.Thrift.Hive.TCLIService.CancelOperationArgs.BinaryProtocol.deserialize(binary_data)) do
        {%Thrift.Hive.TCLIService.CancelOperationArgs{req: req}, ""} ->
          try() do
            rsp = handler_module.cancel_operation(req)
            (
              response = %Thrift.Hive.TCLIService.CancelOperationResponse{success: rsp}
              {:reply, Elixir.Thrift.Hive.TCLIService.CancelOperationResponse.BinaryProtocol.serialize(response)}
            )
          catch
            kind, reason ->
              formatted_exception = Exception.format(kind, reason, System.stacktrace())
              Logger.error("Exception not defined in thrift spec was thrown: #{formatted_exception}")
              error = Thrift.TApplicationException.exception(type: :internal_error, message: "Server error: #{formatted_exception}")
              {:server_error, error}
          rescue
            []
          end
        {_, extra} ->
          raise(Thrift.TApplicationException, type: :protocol_error, message: "Could not decode #{inspect(extra)}")
      end
    end
    def(handle_thrift("CloseOperation", binary_data, handler_module)) do
      case(Elixir.Thrift.Hive.TCLIService.CloseOperationArgs.BinaryProtocol.deserialize(binary_data)) do
        {%Thrift.Hive.TCLIService.CloseOperationArgs{req: req}, ""} ->
          try() do
            rsp = handler_module.close_operation(req)
            (
              response = %Thrift.Hive.TCLIService.CloseOperationResponse{success: rsp}
              {:reply, Elixir.Thrift.Hive.TCLIService.CloseOperationResponse.BinaryProtocol.serialize(response)}
            )
          catch
            kind, reason ->
              formatted_exception = Exception.format(kind, reason, System.stacktrace())
              Logger.error("Exception not defined in thrift spec was thrown: #{formatted_exception}")
              error = Thrift.TApplicationException.exception(type: :internal_error, message: "Server error: #{formatted_exception}")
              {:server_error, error}
          rescue
            []
          end
        {_, extra} ->
          raise(Thrift.TApplicationException, type: :protocol_error, message: "Could not decode #{inspect(extra)}")
      end
    end
    def(handle_thrift("CloseSession", binary_data, handler_module)) do
      case(Elixir.Thrift.Hive.TCLIService.CloseSessionArgs.BinaryProtocol.deserialize(binary_data)) do
        {%Thrift.Hive.TCLIService.CloseSessionArgs{req: req}, ""} ->
          try() do
            rsp = handler_module.close_session(req)
            (
              response = %Thrift.Hive.TCLIService.CloseSessionResponse{success: rsp}
              {:reply, Elixir.Thrift.Hive.TCLIService.CloseSessionResponse.BinaryProtocol.serialize(response)}
            )
          catch
            kind, reason ->
              formatted_exception = Exception.format(kind, reason, System.stacktrace())
              Logger.error("Exception not defined in thrift spec was thrown: #{formatted_exception}")
              error = Thrift.TApplicationException.exception(type: :internal_error, message: "Server error: #{formatted_exception}")
              {:server_error, error}
          rescue
            []
          end
        {_, extra} ->
          raise(Thrift.TApplicationException, type: :protocol_error, message: "Could not decode #{inspect(extra)}")
      end
    end
    def(handle_thrift("ExecuteStatement", binary_data, handler_module)) do
      case(Elixir.Thrift.Hive.TCLIService.ExecuteStatementArgs.BinaryProtocol.deserialize(binary_data)) do
        {%Thrift.Hive.TCLIService.ExecuteStatementArgs{req: req}, ""} ->
          try() do
            rsp = handler_module.execute_statement(req)
            (
              response = %Thrift.Hive.TCLIService.ExecuteStatementResponse{success: rsp}
              {:reply, Elixir.Thrift.Hive.TCLIService.ExecuteStatementResponse.BinaryProtocol.serialize(response)}
            )
          catch
            kind, reason ->
              formatted_exception = Exception.format(kind, reason, System.stacktrace())
              Logger.error("Exception not defined in thrift spec was thrown: #{formatted_exception}")
              error = Thrift.TApplicationException.exception(type: :internal_error, message: "Server error: #{formatted_exception}")
              {:server_error, error}
          rescue
            []
          end
        {_, extra} ->
          raise(Thrift.TApplicationException, type: :protocol_error, message: "Could not decode #{inspect(extra)}")
      end
    end
    def(handle_thrift("FetchResults", binary_data, handler_module)) do
      case(Elixir.Thrift.Hive.TCLIService.FetchResultsArgs.BinaryProtocol.deserialize(binary_data)) do
        {%Thrift.Hive.TCLIService.FetchResultsArgs{req: req}, ""} ->
          try() do
            rsp = handler_module.fetch_results(req)
            (
              response = %Thrift.Hive.TCLIService.FetchResultsResponse{success: rsp}
              {:reply, Elixir.Thrift.Hive.TCLIService.FetchResultsResponse.BinaryProtocol.serialize(response)}
            )
          catch
            kind, reason ->
              formatted_exception = Exception.format(kind, reason, System.stacktrace())
              Logger.error("Exception not defined in thrift spec was thrown: #{formatted_exception}")
              error = Thrift.TApplicationException.exception(type: :internal_error, message: "Server error: #{formatted_exception}")
              {:server_error, error}
          rescue
            []
          end
        {_, extra} ->
          raise(Thrift.TApplicationException, type: :protocol_error, message: "Could not decode #{inspect(extra)}")
      end
    end
    def(handle_thrift("GetCatalogs", binary_data, handler_module)) do
      case(Elixir.Thrift.Hive.TCLIService.GetCatalogsArgs.BinaryProtocol.deserialize(binary_data)) do
        {%Thrift.Hive.TCLIService.GetCatalogsArgs{req: req}, ""} ->
          try() do
            rsp = handler_module.get_catalogs(req)
            (
              response = %Thrift.Hive.TCLIService.GetCatalogsResponse{success: rsp}
              {:reply, Elixir.Thrift.Hive.TCLIService.GetCatalogsResponse.BinaryProtocol.serialize(response)}
            )
          catch
            kind, reason ->
              formatted_exception = Exception.format(kind, reason, System.stacktrace())
              Logger.error("Exception not defined in thrift spec was thrown: #{formatted_exception}")
              error = Thrift.TApplicationException.exception(type: :internal_error, message: "Server error: #{formatted_exception}")
              {:server_error, error}
          rescue
            []
          end
        {_, extra} ->
          raise(Thrift.TApplicationException, type: :protocol_error, message: "Could not decode #{inspect(extra)}")
      end
    end
    def(handle_thrift("GetColumns", binary_data, handler_module)) do
      case(Elixir.Thrift.Hive.TCLIService.GetColumnsArgs.BinaryProtocol.deserialize(binary_data)) do
        {%Thrift.Hive.TCLIService.GetColumnsArgs{req: req}, ""} ->
          try() do
            rsp = handler_module.get_columns(req)
            (
              response = %Thrift.Hive.TCLIService.GetColumnsResponse{success: rsp}
              {:reply, Elixir.Thrift.Hive.TCLIService.GetColumnsResponse.BinaryProtocol.serialize(response)}
            )
          catch
            kind, reason ->
              formatted_exception = Exception.format(kind, reason, System.stacktrace())
              Logger.error("Exception not defined in thrift spec was thrown: #{formatted_exception}")
              error = Thrift.TApplicationException.exception(type: :internal_error, message: "Server error: #{formatted_exception}")
              {:server_error, error}
          rescue
            []
          end
        {_, extra} ->
          raise(Thrift.TApplicationException, type: :protocol_error, message: "Could not decode #{inspect(extra)}")
      end
    end
    def(handle_thrift("GetDelegationToken", binary_data, handler_module)) do
      case(Elixir.Thrift.Hive.TCLIService.GetDelegationTokenArgs.BinaryProtocol.deserialize(binary_data)) do
        {%Thrift.Hive.TCLIService.GetDelegationTokenArgs{req: req}, ""} ->
          try() do
            rsp = handler_module.get_delegation_token(req)
            (
              response = %Thrift.Hive.TCLIService.GetDelegationTokenResponse{success: rsp}
              {:reply, Elixir.Thrift.Hive.TCLIService.GetDelegationTokenResponse.BinaryProtocol.serialize(response)}
            )
          catch
            kind, reason ->
              formatted_exception = Exception.format(kind, reason, System.stacktrace())
              Logger.error("Exception not defined in thrift spec was thrown: #{formatted_exception}")
              error = Thrift.TApplicationException.exception(type: :internal_error, message: "Server error: #{formatted_exception}")
              {:server_error, error}
          rescue
            []
          end
        {_, extra} ->
          raise(Thrift.TApplicationException, type: :protocol_error, message: "Could not decode #{inspect(extra)}")
      end
    end
    def(handle_thrift("GetFunctions", binary_data, handler_module)) do
      case(Elixir.Thrift.Hive.TCLIService.GetFunctionsArgs.BinaryProtocol.deserialize(binary_data)) do
        {%Thrift.Hive.TCLIService.GetFunctionsArgs{req: req}, ""} ->
          try() do
            rsp = handler_module.get_functions(req)
            (
              response = %Thrift.Hive.TCLIService.GetFunctionsResponse{success: rsp}
              {:reply, Elixir.Thrift.Hive.TCLIService.GetFunctionsResponse.BinaryProtocol.serialize(response)}
            )
          catch
            kind, reason ->
              formatted_exception = Exception.format(kind, reason, System.stacktrace())
              Logger.error("Exception not defined in thrift spec was thrown: #{formatted_exception}")
              error = Thrift.TApplicationException.exception(type: :internal_error, message: "Server error: #{formatted_exception}")
              {:server_error, error}
          rescue
            []
          end
        {_, extra} ->
          raise(Thrift.TApplicationException, type: :protocol_error, message: "Could not decode #{inspect(extra)}")
      end
    end
    def(handle_thrift("GetInfo", binary_data, handler_module)) do
      case(Elixir.Thrift.Hive.TCLIService.GetInfoArgs.BinaryProtocol.deserialize(binary_data)) do
        {%Thrift.Hive.TCLIService.GetInfoArgs{req: req}, ""} ->
          try() do
            rsp = handler_module.get_info(req)
            (
              response = %Thrift.Hive.TCLIService.GetInfoResponse{success: rsp}
              {:reply, Elixir.Thrift.Hive.TCLIService.GetInfoResponse.BinaryProtocol.serialize(response)}
            )
          catch
            kind, reason ->
              formatted_exception = Exception.format(kind, reason, System.stacktrace())
              Logger.error("Exception not defined in thrift spec was thrown: #{formatted_exception}")
              error = Thrift.TApplicationException.exception(type: :internal_error, message: "Server error: #{formatted_exception}")
              {:server_error, error}
          rescue
            []
          end
        {_, extra} ->
          raise(Thrift.TApplicationException, type: :protocol_error, message: "Could not decode #{inspect(extra)}")
      end
    end
    def(handle_thrift("GetOperationStatus", binary_data, handler_module)) do
      case(Elixir.Thrift.Hive.TCLIService.GetOperationStatusArgs.BinaryProtocol.deserialize(binary_data)) do
        {%Thrift.Hive.TCLIService.GetOperationStatusArgs{req: req}, ""} ->
          try() do
            rsp = handler_module.get_operation_status(req)
            (
              response = %Thrift.Hive.TCLIService.GetOperationStatusResponse{success: rsp}
              {:reply, Elixir.Thrift.Hive.TCLIService.GetOperationStatusResponse.BinaryProtocol.serialize(response)}
            )
          catch
            kind, reason ->
              formatted_exception = Exception.format(kind, reason, System.stacktrace())
              Logger.error("Exception not defined in thrift spec was thrown: #{formatted_exception}")
              error = Thrift.TApplicationException.exception(type: :internal_error, message: "Server error: #{formatted_exception}")
              {:server_error, error}
          rescue
            []
          end
        {_, extra} ->
          raise(Thrift.TApplicationException, type: :protocol_error, message: "Could not decode #{inspect(extra)}")
      end
    end
    def(handle_thrift("GetResultSetMetadata", binary_data, handler_module)) do
      case(Elixir.Thrift.Hive.TCLIService.GetResultSetMetadataArgs.BinaryProtocol.deserialize(binary_data)) do
        {%Thrift.Hive.TCLIService.GetResultSetMetadataArgs{req: req}, ""} ->
          try() do
            rsp = handler_module.get_result_set_metadata(req)
            (
              response = %Thrift.Hive.TCLIService.GetResultSetMetadataResponse{success: rsp}
              {:reply, Elixir.Thrift.Hive.TCLIService.GetResultSetMetadataResponse.BinaryProtocol.serialize(response)}
            )
          catch
            kind, reason ->
              formatted_exception = Exception.format(kind, reason, System.stacktrace())
              Logger.error("Exception not defined in thrift spec was thrown: #{formatted_exception}")
              error = Thrift.TApplicationException.exception(type: :internal_error, message: "Server error: #{formatted_exception}")
              {:server_error, error}
          rescue
            []
          end
        {_, extra} ->
          raise(Thrift.TApplicationException, type: :protocol_error, message: "Could not decode #{inspect(extra)}")
      end
    end
    def(handle_thrift("GetSchemas", binary_data, handler_module)) do
      case(Elixir.Thrift.Hive.TCLIService.GetSchemasArgs.BinaryProtocol.deserialize(binary_data)) do
        {%Thrift.Hive.TCLIService.GetSchemasArgs{req: req}, ""} ->
          try() do
            rsp = handler_module.get_schemas(req)
            (
              response = %Thrift.Hive.TCLIService.GetSchemasResponse{success: rsp}
              {:reply, Elixir.Thrift.Hive.TCLIService.GetSchemasResponse.BinaryProtocol.serialize(response)}
            )
          catch
            kind, reason ->
              formatted_exception = Exception.format(kind, reason, System.stacktrace())
              Logger.error("Exception not defined in thrift spec was thrown: #{formatted_exception}")
              error = Thrift.TApplicationException.exception(type: :internal_error, message: "Server error: #{formatted_exception}")
              {:server_error, error}
          rescue
            []
          end
        {_, extra} ->
          raise(Thrift.TApplicationException, type: :protocol_error, message: "Could not decode #{inspect(extra)}")
      end
    end
    def(handle_thrift("GetTableTypes", binary_data, handler_module)) do
      case(Elixir.Thrift.Hive.TCLIService.GetTableTypesArgs.BinaryProtocol.deserialize(binary_data)) do
        {%Thrift.Hive.TCLIService.GetTableTypesArgs{req: req}, ""} ->
          try() do
            rsp = handler_module.get_table_types(req)
            (
              response = %Thrift.Hive.TCLIService.GetTableTypesResponse{success: rsp}
              {:reply, Elixir.Thrift.Hive.TCLIService.GetTableTypesResponse.BinaryProtocol.serialize(response)}
            )
          catch
            kind, reason ->
              formatted_exception = Exception.format(kind, reason, System.stacktrace())
              Logger.error("Exception not defined in thrift spec was thrown: #{formatted_exception}")
              error = Thrift.TApplicationException.exception(type: :internal_error, message: "Server error: #{formatted_exception}")
              {:server_error, error}
          rescue
            []
          end
        {_, extra} ->
          raise(Thrift.TApplicationException, type: :protocol_error, message: "Could not decode #{inspect(extra)}")
      end
    end
    def(handle_thrift("GetTables", binary_data, handler_module)) do
      case(Elixir.Thrift.Hive.TCLIService.GetTablesArgs.BinaryProtocol.deserialize(binary_data)) do
        {%Thrift.Hive.TCLIService.GetTablesArgs{req: req}, ""} ->
          try() do
            rsp = handler_module.get_tables(req)
            (
              response = %Thrift.Hive.TCLIService.GetTablesResponse{success: rsp}
              {:reply, Elixir.Thrift.Hive.TCLIService.GetTablesResponse.BinaryProtocol.serialize(response)}
            )
          catch
            kind, reason ->
              formatted_exception = Exception.format(kind, reason, System.stacktrace())
              Logger.error("Exception not defined in thrift spec was thrown: #{formatted_exception}")
              error = Thrift.TApplicationException.exception(type: :internal_error, message: "Server error: #{formatted_exception}")
              {:server_error, error}
          rescue
            []
          end
        {_, extra} ->
          raise(Thrift.TApplicationException, type: :protocol_error, message: "Could not decode #{inspect(extra)}")
      end
    end
    def(handle_thrift("GetTypeInfo", binary_data, handler_module)) do
      case(Elixir.Thrift.Hive.TCLIService.GetTypeInfoArgs.BinaryProtocol.deserialize(binary_data)) do
        {%Thrift.Hive.TCLIService.GetTypeInfoArgs{req: req}, ""} ->
          try() do
            rsp = handler_module.get_type_info(req)
            (
              response = %Thrift.Hive.TCLIService.GetTypeInfoResponse{success: rsp}
              {:reply, Elixir.Thrift.Hive.TCLIService.GetTypeInfoResponse.BinaryProtocol.serialize(response)}
            )
          catch
            kind, reason ->
              formatted_exception = Exception.format(kind, reason, System.stacktrace())
              Logger.error("Exception not defined in thrift spec was thrown: #{formatted_exception}")
              error = Thrift.TApplicationException.exception(type: :internal_error, message: "Server error: #{formatted_exception}")
              {:server_error, error}
          rescue
            []
          end
        {_, extra} ->
          raise(Thrift.TApplicationException, type: :protocol_error, message: "Could not decode #{inspect(extra)}")
      end
    end
    def(handle_thrift("OpenSession", binary_data, handler_module)) do
      case(Elixir.Thrift.Hive.TCLIService.OpenSessionArgs.BinaryProtocol.deserialize(binary_data)) do
        {%Thrift.Hive.TCLIService.OpenSessionArgs{req: req}, ""} ->
          try() do
            rsp = handler_module.open_session(req)
            (
              response = %Thrift.Hive.TCLIService.OpenSessionResponse{success: rsp}
              {:reply, Elixir.Thrift.Hive.TCLIService.OpenSessionResponse.BinaryProtocol.serialize(response)}
            )
          catch
            kind, reason ->
              formatted_exception = Exception.format(kind, reason, System.stacktrace())
              Logger.error("Exception not defined in thrift spec was thrown: #{formatted_exception}")
              error = Thrift.TApplicationException.exception(type: :internal_error, message: "Server error: #{formatted_exception}")
              {:server_error, error}
          rescue
            []
          end
        {_, extra} ->
          raise(Thrift.TApplicationException, type: :protocol_error, message: "Could not decode #{inspect(extra)}")
      end
    end
    def(handle_thrift("RenewDelegationToken", binary_data, handler_module)) do
      case(Elixir.Thrift.Hive.TCLIService.RenewDelegationTokenArgs.BinaryProtocol.deserialize(binary_data)) do
        {%Thrift.Hive.TCLIService.RenewDelegationTokenArgs{req: req}, ""} ->
          try() do
            rsp = handler_module.renew_delegation_token(req)
            (
              response = %Thrift.Hive.TCLIService.RenewDelegationTokenResponse{success: rsp}
              {:reply, Elixir.Thrift.Hive.TCLIService.RenewDelegationTokenResponse.BinaryProtocol.serialize(response)}
            )
          catch
            kind, reason ->
              formatted_exception = Exception.format(kind, reason, System.stacktrace())
              Logger.error("Exception not defined in thrift spec was thrown: #{formatted_exception}")
              error = Thrift.TApplicationException.exception(type: :internal_error, message: "Server error: #{formatted_exception}")
              {:server_error, error}
          rescue
            []
          end
        {_, extra} ->
          raise(Thrift.TApplicationException, type: :protocol_error, message: "Could not decode #{inspect(extra)}")
      end
    end
  end
end