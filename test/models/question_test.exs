defmodule SimpleBase.QuestionTest do
  use SimpleBase.ModelCase

  alias SimpleBase.Question

  @valid_attrs %{human_sql: %{}, last_updated: %{day: 17, hour: 14, min: 0, month: 4, sec: 0, year: 2010}, sql: "some content", title: "some content", update_interval: 42}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Question.changeset(%Question{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Question.changeset(%Question{}, @invalid_attrs)
    refute changeset.valid?
  end
end
