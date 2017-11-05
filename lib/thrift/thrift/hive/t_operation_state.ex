defmodule(Thrift.Hive.TOperationState) do
  @moduledoc("Auto-generated Thrift enum TCLIService.TOperationState")
  defmacro(initialized_state) do
    1
  end
  defmacro(running_state) do
    2
  end
  defmacro(finished_state) do
    3
  end
  defmacro(canceled_state) do
    4
  end
  defmacro(closed_state) do
    5
  end
  defmacro(error_state) do
    6
  end
  defmacro(uknown_state) do
    7
  end
  defmacro(pending_state) do
    8
  end
  def(value_to_name(1)) do
    {:ok, :initialized_state}
  end
  def(value_to_name(2)) do
    {:ok, :running_state}
  end
  def(value_to_name(3)) do
    {:ok, :finished_state}
  end
  def(value_to_name(4)) do
    {:ok, :canceled_state}
  end
  def(value_to_name(5)) do
    {:ok, :closed_state}
  end
  def(value_to_name(6)) do
    {:ok, :error_state}
  end
  def(value_to_name(7)) do
    {:ok, :uknown_state}
  end
  def(value_to_name(8)) do
    {:ok, :pending_state}
  end
  def(value_to_name(v)) do
    {:error, {:invalid_enum_value, v}}
  end
  def(name_to_value(:initialized_state)) do
    {:ok, 1}
  end
  def(name_to_value(:running_state)) do
    {:ok, 2}
  end
  def(name_to_value(:finished_state)) do
    {:ok, 3}
  end
  def(name_to_value(:canceled_state)) do
    {:ok, 4}
  end
  def(name_to_value(:closed_state)) do
    {:ok, 5}
  end
  def(name_to_value(:error_state)) do
    {:ok, 6}
  end
  def(name_to_value(:uknown_state)) do
    {:ok, 7}
  end
  def(name_to_value(:pending_state)) do
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
    [:initialized_state, :running_state, :finished_state, :canceled_state, :closed_state, :error_state, :uknown_state, :pending_state]
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
  def(name?(:initialized_state)) do
    true
  end
  def(name?(:running_state)) do
    true
  end
  def(name?(:finished_state)) do
    true
  end
  def(name?(:canceled_state)) do
    true
  end
  def(name?(:closed_state)) do
    true
  end
  def(name?(:error_state)) do
    true
  end
  def(name?(:uknown_state)) do
    true
  end
  def(name?(:pending_state)) do
    true
  end
  def(name?(_)) do
    false
  end
end