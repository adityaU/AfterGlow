defmodule(Thrift.Hive.TFetchOrientation) do
  @moduledoc("Auto-generated Thrift enum TCLIService.TFetchOrientation")
  defmacro(fetch_next) do
    1
  end
  defmacro(fetch_prior) do
    2
  end
  defmacro(fetch_relative) do
    3
  end
  defmacro(fetch_absolute) do
    4
  end
  defmacro(fetch_first) do
    5
  end
  defmacro(fetch_last) do
    6
  end
  def(value_to_name(1)) do
    {:ok, :fetch_next}
  end
  def(value_to_name(2)) do
    {:ok, :fetch_prior}
  end
  def(value_to_name(3)) do
    {:ok, :fetch_relative}
  end
  def(value_to_name(4)) do
    {:ok, :fetch_absolute}
  end
  def(value_to_name(5)) do
    {:ok, :fetch_first}
  end
  def(value_to_name(6)) do
    {:ok, :fetch_last}
  end
  def(value_to_name(v)) do
    {:error, {:invalid_enum_value, v}}
  end
  def(name_to_value(:fetch_next)) do
    {:ok, 1}
  end
  def(name_to_value(:fetch_prior)) do
    {:ok, 2}
  end
  def(name_to_value(:fetch_relative)) do
    {:ok, 3}
  end
  def(name_to_value(:fetch_absolute)) do
    {:ok, 4}
  end
  def(name_to_value(:fetch_first)) do
    {:ok, 5}
  end
  def(name_to_value(:fetch_last)) do
    {:ok, 6}
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
    [:fetch_next, :fetch_prior, :fetch_relative, :fetch_absolute, :fetch_first, :fetch_last]
  end
  def(meta(:values)) do
    [1, 2, 3, 4, 5, 6]
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
  def(member?(_)) do
    false
  end
  def(name?(:fetch_next)) do
    true
  end
  def(name?(:fetch_prior)) do
    true
  end
  def(name?(:fetch_relative)) do
    true
  end
  def(name?(:fetch_absolute)) do
    true
  end
  def(name?(:fetch_first)) do
    true
  end
  def(name?(:fetch_last)) do
    true
  end
  def(name?(_)) do
    false
  end
end