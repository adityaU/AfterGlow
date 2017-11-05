defmodule(Thrift.Hive.TTypeId) do
  @moduledoc("Auto-generated Thrift enum TCLIService.TTypeId")
  defmacro(boolean_type) do
    1
  end
  defmacro(tinyint_type) do
    2
  end
  defmacro(smallint_type) do
    3
  end
  defmacro(int_type) do
    4
  end
  defmacro(bigint_type) do
    5
  end
  defmacro(float_type) do
    6
  end
  defmacro(double_type) do
    7
  end
  defmacro(string_type) do
    8
  end
  defmacro(timestamp_type) do
    9
  end
  defmacro(binary_type) do
    10
  end
  defmacro(array_type) do
    11
  end
  defmacro(map_type) do
    12
  end
  defmacro(struct_type) do
    13
  end
  defmacro(union_type) do
    14
  end
  defmacro(user_defined_type) do
    15
  end
  defmacro(decimal_type) do
    16
  end
  defmacro(null_type) do
    17
  end
  defmacro(date_type) do
    18
  end
  defmacro(varchar_type) do
    19
  end
  defmacro(char_type) do
    20
  end
  defmacro(interval_year_month_type) do
    21
  end
  defmacro(interval_day_time_type) do
    22
  end
  def(value_to_name(1)) do
    {:ok, :boolean_type}
  end
  def(value_to_name(2)) do
    {:ok, :tinyint_type}
  end
  def(value_to_name(3)) do
    {:ok, :smallint_type}
  end
  def(value_to_name(4)) do
    {:ok, :int_type}
  end
  def(value_to_name(5)) do
    {:ok, :bigint_type}
  end
  def(value_to_name(6)) do
    {:ok, :float_type}
  end
  def(value_to_name(7)) do
    {:ok, :double_type}
  end
  def(value_to_name(8)) do
    {:ok, :string_type}
  end
  def(value_to_name(9)) do
    {:ok, :timestamp_type}
  end
  def(value_to_name(10)) do
    {:ok, :binary_type}
  end
  def(value_to_name(11)) do
    {:ok, :array_type}
  end
  def(value_to_name(12)) do
    {:ok, :map_type}
  end
  def(value_to_name(13)) do
    {:ok, :struct_type}
  end
  def(value_to_name(14)) do
    {:ok, :union_type}
  end
  def(value_to_name(15)) do
    {:ok, :user_defined_type}
  end
  def(value_to_name(16)) do
    {:ok, :decimal_type}
  end
  def(value_to_name(17)) do
    {:ok, :null_type}
  end
  def(value_to_name(18)) do
    {:ok, :date_type}
  end
  def(value_to_name(19)) do
    {:ok, :varchar_type}
  end
  def(value_to_name(20)) do
    {:ok, :char_type}
  end
  def(value_to_name(21)) do
    {:ok, :interval_year_month_type}
  end
  def(value_to_name(22)) do
    {:ok, :interval_day_time_type}
  end
  def(value_to_name(v)) do
    {:error, {:invalid_enum_value, v}}
  end
  def(name_to_value(:boolean_type)) do
    {:ok, 1}
  end
  def(name_to_value(:tinyint_type)) do
    {:ok, 2}
  end
  def(name_to_value(:smallint_type)) do
    {:ok, 3}
  end
  def(name_to_value(:int_type)) do
    {:ok, 4}
  end
  def(name_to_value(:bigint_type)) do
    {:ok, 5}
  end
  def(name_to_value(:float_type)) do
    {:ok, 6}
  end
  def(name_to_value(:double_type)) do
    {:ok, 7}
  end
  def(name_to_value(:string_type)) do
    {:ok, 8}
  end
  def(name_to_value(:timestamp_type)) do
    {:ok, 9}
  end
  def(name_to_value(:binary_type)) do
    {:ok, 10}
  end
  def(name_to_value(:array_type)) do
    {:ok, 11}
  end
  def(name_to_value(:map_type)) do
    {:ok, 12}
  end
  def(name_to_value(:struct_type)) do
    {:ok, 13}
  end
  def(name_to_value(:union_type)) do
    {:ok, 14}
  end
  def(name_to_value(:user_defined_type)) do
    {:ok, 15}
  end
  def(name_to_value(:decimal_type)) do
    {:ok, 16}
  end
  def(name_to_value(:null_type)) do
    {:ok, 17}
  end
  def(name_to_value(:date_type)) do
    {:ok, 18}
  end
  def(name_to_value(:varchar_type)) do
    {:ok, 19}
  end
  def(name_to_value(:char_type)) do
    {:ok, 20}
  end
  def(name_to_value(:interval_year_month_type)) do
    {:ok, 21}
  end
  def(name_to_value(:interval_day_time_type)) do
    {:ok, 22}
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
    [:boolean_type, :tinyint_type, :smallint_type, :int_type, :bigint_type, :float_type, :double_type, :string_type, :timestamp_type, :binary_type, :array_type, :map_type, :struct_type, :union_type, :user_defined_type, :decimal_type, :null_type, :date_type, :varchar_type, :char_type, :interval_year_month_type, :interval_day_time_type]
  end
  def(meta(:values)) do
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
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
  def(member?(10)) do
    true
  end
  def(member?(11)) do
    true
  end
  def(member?(12)) do
    true
  end
  def(member?(13)) do
    true
  end
  def(member?(14)) do
    true
  end
  def(member?(15)) do
    true
  end
  def(member?(16)) do
    true
  end
  def(member?(17)) do
    true
  end
  def(member?(18)) do
    true
  end
  def(member?(19)) do
    true
  end
  def(member?(20)) do
    true
  end
  def(member?(21)) do
    true
  end
  def(member?(22)) do
    true
  end
  def(member?(_)) do
    false
  end
  def(name?(:boolean_type)) do
    true
  end
  def(name?(:tinyint_type)) do
    true
  end
  def(name?(:smallint_type)) do
    true
  end
  def(name?(:int_type)) do
    true
  end
  def(name?(:bigint_type)) do
    true
  end
  def(name?(:float_type)) do
    true
  end
  def(name?(:double_type)) do
    true
  end
  def(name?(:string_type)) do
    true
  end
  def(name?(:timestamp_type)) do
    true
  end
  def(name?(:binary_type)) do
    true
  end
  def(name?(:array_type)) do
    true
  end
  def(name?(:map_type)) do
    true
  end
  def(name?(:struct_type)) do
    true
  end
  def(name?(:union_type)) do
    true
  end
  def(name?(:user_defined_type)) do
    true
  end
  def(name?(:decimal_type)) do
    true
  end
  def(name?(:null_type)) do
    true
  end
  def(name?(:date_type)) do
    true
  end
  def(name?(:varchar_type)) do
    true
  end
  def(name?(:char_type)) do
    true
  end
  def(name?(:interval_year_month_type)) do
    true
  end
  def(name?(:interval_day_time_type)) do
    true
  end
  def(name?(_)) do
    false
  end
end