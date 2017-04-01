defmodule SimpleBase.PermissionSetTest do
  use SimpleBase.ModelCase

  alias SimpleBase.PermissionSet

  @valid_attrs %{name: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = PermissionSet.changeset(%PermissionSet{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = PermissionSet.changeset(%PermissionSet{}, @invalid_attrs)
    refute changeset.valid?
  end
end
