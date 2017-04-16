defmodule AfterGlow.VariableTest do
  use AfterGlow.ModelCase

  alias AfterGlow.Variable

  @valid_attrs %{default: "some content", name: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Variable.changeset(%Variable{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Variable.changeset(%Variable{}, @invalid_attrs)
    refute changeset.valid?
  end
end
