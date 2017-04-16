defmodule AfterGlow.VariableDashboardTest do
  use AfterGlow.ModelCase

  alias AfterGlow.VariableDashboard

  @valid_attrs %{}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = VariableDashboard.changeset(%VariableDashboard{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = VariableDashboard.changeset(%VariableDashboard{}, @invalid_attrs)
    refute changeset.valid?
  end
end
