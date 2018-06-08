defmodule AfterGlow.WidgetsTest do
  use AfterGlow.ModelCase

  alias AfterGlow.Widgets

  @valid_attrs %{}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Widgets.changeset(%Widgets{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Widgets.changeset(%Widgets{}, @invalid_attrs)
    refute changeset.valid?
  end
end
