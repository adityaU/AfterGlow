defmodule AfterGlow.PermissionTest do
  use AfterGlow.ModelCase

  alias AfterGlow.Permission

  @valid_attrs %{name: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Permission.changeset(%Permission{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Permission.changeset(%Permission{}, @invalid_attrs)
    refute changeset.valid?
  end
end
