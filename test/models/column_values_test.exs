defmodule AfterGlow.ColumnValuesTest do
  use AfterGlow.ModelCase

  alias AfterGlow.ColumnValues

  @valid_attrs %{name: "some content", value: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = ColumnValues.changeset(%ColumnValues{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = ColumnValues.changeset(%ColumnValues{}, @invalid_attrs)
    refute changeset.valid?
  end
end
