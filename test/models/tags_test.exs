defmodule AfterGlow.TagsTest do
  use AfterGlow.ModelCase

  alias AfterGlow.Tags

  @valid_attrs %{description: "some content", name: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Tags.changeset(%Tags{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Tags.changeset(%Tags{}, @invalid_attrs)
    refute changeset.valid?
  end
end
