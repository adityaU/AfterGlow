defmodule AfterGlow.QuestionWidgetTest do
  use AfterGlow.ModelCase

  alias AfterGlow.QuestionWidget

  @valid_attrs %{}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = QuestionWidget.changeset(%QuestionWidget{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = QuestionWidget.changeset(%QuestionWidget{}, @invalid_attrs)
    refute changeset.valid?
  end
end
