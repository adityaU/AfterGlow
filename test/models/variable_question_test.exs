defmodule AfterGlow.VariableQuestionTest do
  use AfterGlow.ModelCase

  alias AfterGlow.VariableQuestion

  @valid_attrs %{}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = VariableQuestion.changeset(%VariableQuestion{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = VariableQuestion.changeset(%VariableQuestion{}, @invalid_attrs)
    refute changeset.valid?
  end
end
