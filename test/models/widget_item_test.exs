defmodule AfterGlow.WidgetItemTest do
  use AfterGlow.ModelCase

  alias AfterGlow.WidgetItem

  @valid_attrs %{}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = WidgetItem.changeset(%WidgetItem{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = WidgetItem.changeset(%WidgetItem{}, @invalid_attrs)
    refute changeset.valid?
  end
end
