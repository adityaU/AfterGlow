defmodule SimpleBase.DatabaseTest do
  use SimpleBase.ModelCase

  alias SimpleBase.Database

  @valid_attrs %{config: %{}, name: "some content", type: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Database.changeset(%Database{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Database.changeset(%Database{}, @invalid_attrs)
    refute changeset.valid?
  end
end
