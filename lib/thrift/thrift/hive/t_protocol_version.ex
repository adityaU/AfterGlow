defmodule(Thrift.Hive.TProtocolVersion) do
  @moduledoc("Auto-generated Thrift enum TCLIService.TProtocolVersion")
  defmacro(hive_cli_service_protocol_v1) do
    1
  end
  defmacro(hive_cli_service_protocol_v2) do
    2
  end
  defmacro(hive_cli_service_protocol_v3) do
    3
  end
  defmacro(hive_cli_service_protocol_v4) do
    4
  end
  defmacro(hive_cli_service_protocol_v5) do
    5
  end
  defmacro(hive_cli_service_protocol_v6) do
    6
  end
  defmacro(hive_cli_service_protocol_v7) do
    7
  end
  defmacro(hive_cli_service_protocol_v8) do
    8
  end
  def(value_to_name(1)) do
    {:ok, :hive_cli_service_protocol_v1}
  end
  def(value_to_name(2)) do
    {:ok, :hive_cli_service_protocol_v2}
  end
  def(value_to_name(3)) do
    {:ok, :hive_cli_service_protocol_v3}
  end
  def(value_to_name(4)) do
    {:ok, :hive_cli_service_protocol_v4}
  end
  def(value_to_name(5)) do
    {:ok, :hive_cli_service_protocol_v5}
  end
  def(value_to_name(6)) do
    {:ok, :hive_cli_service_protocol_v6}
  end
  def(value_to_name(7)) do
    {:ok, :hive_cli_service_protocol_v7}
  end
  def(value_to_name(8)) do
    {:ok, :hive_cli_service_protocol_v8}
  end
  def(value_to_name(v)) do
    {:error, {:invalid_enum_value, v}}
  end
  def(name_to_value(:hive_cli_service_protocol_v1)) do
    {:ok, 1}
  end
  def(name_to_value(:hive_cli_service_protocol_v2)) do
    {:ok, 2}
  end
  def(name_to_value(:hive_cli_service_protocol_v3)) do
    {:ok, 3}
  end
  def(name_to_value(:hive_cli_service_protocol_v4)) do
    {:ok, 4}
  end
  def(name_to_value(:hive_cli_service_protocol_v5)) do
    {:ok, 5}
  end
  def(name_to_value(:hive_cli_service_protocol_v6)) do
    {:ok, 6}
  end
  def(name_to_value(:hive_cli_service_protocol_v7)) do
    {:ok, 7}
  end
  def(name_to_value(:hive_cli_service_protocol_v8)) do
    {:ok, 8}
  end
  def(name_to_value(k)) do
    {:error, {:invalid_enum_name, k}}
  end
  def(value_to_name!(value)) do
    {:ok, name} = value_to_name(value)
    name
  end
  def(name_to_value!(name)) do
    {:ok, value} = name_to_value(name)
    value
  end
  def(meta(:names)) do
    [:hive_cli_service_protocol_v1, :hive_cli_service_protocol_v2, :hive_cli_service_protocol_v3, :hive_cli_service_protocol_v4, :hive_cli_service_protocol_v5, :hive_cli_service_protocol_v6, :hive_cli_service_protocol_v7, :hive_cli_service_protocol_v8]
  end
  def(meta(:values)) do
    [1, 2, 3, 4, 5, 6, 7, 8]
  end
  def(member?(1)) do
    true
  end
  def(member?(2)) do
    true
  end
  def(member?(3)) do
    true
  end
  def(member?(4)) do
    true
  end
  def(member?(5)) do
    true
  end
  def(member?(6)) do
    true
  end
  def(member?(7)) do
    true
  end
  def(member?(8)) do
    true
  end
  def(member?(_)) do
    false
  end
  def(name?(:hive_cli_service_protocol_v1)) do
    true
  end
  def(name?(:hive_cli_service_protocol_v2)) do
    true
  end
  def(name?(:hive_cli_service_protocol_v3)) do
    true
  end
  def(name?(:hive_cli_service_protocol_v4)) do
    true
  end
  def(name?(:hive_cli_service_protocol_v5)) do
    true
  end
  def(name?(:hive_cli_service_protocol_v6)) do
    true
  end
  def(name?(:hive_cli_service_protocol_v7)) do
    true
  end
  def(name?(:hive_cli_service_protocol_v8)) do
    true
  end
  def(name?(_)) do
    false
  end
end