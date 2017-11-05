defmodule(Thrift.Hive.TOperationType) do
  @moduledoc("Auto-generated Thrift enum TCLIService.TOperationType")
  defmacro(execute_statement) do
    1
  end
  defmacro(get_type_info) do
    2
  end
  defmacro(get_catalogs) do
    3
  end
  defmacro(get_schemas) do
    4
  end
  defmacro(get_tables) do
    5
  end
  defmacro(get_table_types) do
    6
  end
  defmacro(get_columns) do
    7
  end
  defmacro(get_functions) do
    8
  end
  defmacro(unknown) do
    9
  end
  def(value_to_name(1)) do
    {:ok, :execute_statement}
  end
  def(value_to_name(2)) do
    {:ok, :get_type_info}
  end
  def(value_to_name(3)) do
    {:ok, :get_catalogs}
  end
  def(value_to_name(4)) do
    {:ok, :get_schemas}
  end
  def(value_to_name(5)) do
    {:ok, :get_tables}
  end
  def(value_to_name(6)) do
    {:ok, :get_table_types}
  end
  def(value_to_name(7)) do
    {:ok, :get_columns}
  end
  def(value_to_name(8)) do
    {:ok, :get_functions}
  end
  def(value_to_name(9)) do
    {:ok, :unknown}
  end
  def(value_to_name(v)) do
    {:error, {:invalid_enum_value, v}}
  end
  def(name_to_value(:execute_statement)) do
    {:ok, 1}
  end
  def(name_to_value(:get_type_info)) do
    {:ok, 2}
  end
  def(name_to_value(:get_catalogs)) do
    {:ok, 3}
  end
  def(name_to_value(:get_schemas)) do
    {:ok, 4}
  end
  def(name_to_value(:get_tables)) do
    {:ok, 5}
  end
  def(name_to_value(:get_table_types)) do
    {:ok, 6}
  end
  def(name_to_value(:get_columns)) do
    {:ok, 7}
  end
  def(name_to_value(:get_functions)) do
    {:ok, 8}
  end
  def(name_to_value(:unknown)) do
    {:ok, 9}
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
    [:execute_statement, :get_type_info, :get_catalogs, :get_schemas, :get_tables, :get_table_types, :get_columns, :get_functions, :unknown]
  end
  def(meta(:values)) do
    [1, 2, 3, 4, 5, 6, 7, 8, 9]
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
  def(member?(9)) do
    true
  end
  def(member?(_)) do
    false
  end
  def(name?(:execute_statement)) do
    true
  end
  def(name?(:get_type_info)) do
    true
  end
  def(name?(:get_catalogs)) do
    true
  end
  def(name?(:get_schemas)) do
    true
  end
  def(name?(:get_tables)) do
    true
  end
  def(name?(:get_table_types)) do
    true
  end
  def(name?(:get_columns)) do
    true
  end
  def(name?(:get_functions)) do
    true
  end
  def(name?(:unknown)) do
    true
  end
  def(name?(_)) do
    false
  end
end