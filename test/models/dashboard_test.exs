defmodule SimpleBase.DashboardTest do
  use SimpleBase.ModelCase

  alias SimpleBase.Dashboard

  @valid_attrs %{last_updated: %{day: 17, hour: 14, min: 0, month: 4, sec: 0, year: 2010}, title: "some content", update_interval: 42}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Dashboard.changeset(%Dashboard{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Dashboard.changeset(%Dashboard{}, @invalid_attrs)
    refute changeset.valid?
  end
end
