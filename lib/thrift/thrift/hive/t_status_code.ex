defmodule(Thrift.Hive.TStatusCode) do
  @moduledoc("Auto-generated Thrift enum TCLIService.TStatusCode")
  defmacro(success_status) do
    1
  end
  defmacro(success_with_info_status) do
    2
  end
  defmacro(still_executing_status) do
    3
  end
  defmacro(error_status) do
    4
  end
  defmacro(invalid_handle_status) do
    5
  end
  def(value_to_name(1)) do
    {:ok, :success_status}
  end
  def(value_to_name(2)) do
    {:ok, :success_with_info_status}
  end
  def(value_to_name(3)) do
    {:ok, :still_executing_status}
  end
  def(value_to_name(4)) do
    {:ok, :error_status}
  end
  def(value_to_name(5)) do
    {:ok, :invalid_handle_status}
  end
  def(value_to_name(v)) do
    {:error, {:invalid_enum_value, v}}
  end
  def(name_to_value(:success_status)) do
    {:ok, 1}
  end
  def(name_to_value(:success_with_info_status)) do
    {:ok, 2}
  end
  def(name_to_value(:still_executing_status)) do
    {:ok, 3}
  end
  def(name_to_value(:error_status)) do
    {:ok, 4}
  end
  def(name_to_value(:invalid_handle_status)) do
    {:ok, 5}
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
    [:success_status, :success_with_info_status, :still_executing_status, :error_status, :invalid_handle_status]
  end
  def(meta(:values)) do
    [1, 2, 3, 4, 5]
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
  def(member?(_)) do
    false
  end
  def(name?(:success_status)) do
    true
  end
  def(name?(:success_with_info_status)) do
    true
  end
  def(name?(:still_executing_status)) do
    true
  end
  def(name?(:error_status)) do
    true
  end
  def(name?(:invalid_handle_status)) do
    true
  end
  def(name?(_)) do
    false
  end
end