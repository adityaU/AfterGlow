defmodule AfterGlow.QuestionBankTest do
  use AfterGlow.ModelCase

  alias AfterGlow.QuestionBank

  @valid_attrs %{questions: [], title: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = QuestionBank.changeset(%QuestionBank{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = QuestionBank.changeset(%QuestionBank{}, @invalid_attrs)
    refute changeset.valid?
  end
end
