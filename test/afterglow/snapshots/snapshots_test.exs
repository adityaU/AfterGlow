defmodule AfterGlow.SnapshotsTest do
  use AfterGlow.DataCase

  alias AfterGlow.Snapshots

  describe "snapshots" do
    alias AfterGlow.Snapshots.Snapshot

    @valid_attrs %{columns: [], name: "some name"}
    @update_attrs %{columns: [], name: "some updated name"}
    @invalid_attrs %{columns: nil, name: nil}

    def snapshot_fixture(attrs \\ %{}) do
      {:ok, snapshot} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Snapshots.create_snapshot()

      snapshot
    end

    test "list_snapshots/0 returns all snapshots" do
      snapshot = snapshot_fixture()
      assert Snapshots.list_snapshots() == [snapshot]
    end

    test "get_snapshot!/1 returns the snapshot with given id" do
      snapshot = snapshot_fixture()
      assert Snapshots.get_snapshot!(snapshot.id) == snapshot
    end

    test "create_snapshot/1 with valid data creates a snapshot" do
      assert {:ok, %Snapshot{} = snapshot} = Snapshots.create_snapshot(@valid_attrs)
      assert snapshot.columns == []
      assert snapshot.name == "some name"
    end

    test "create_snapshot/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Snapshots.create_snapshot(@invalid_attrs)
    end

    test "update_snapshot/2 with valid data updates the snapshot" do
      snapshot = snapshot_fixture()
      assert {:ok, snapshot} = Snapshots.update_snapshot(snapshot, @update_attrs)
      assert %Snapshot{} = snapshot
      assert snapshot.columns == []
      assert snapshot.name == "some updated name"
    end

    test "update_snapshot/2 with invalid data returns error changeset" do
      snapshot = snapshot_fixture()
      assert {:error, %Ecto.Changeset{}} = Snapshots.update_snapshot(snapshot, @invalid_attrs)
      assert snapshot == Snapshots.get_snapshot!(snapshot.id)
    end

    test "delete_snapshot/1 deletes the snapshot" do
      snapshot = snapshot_fixture()
      assert {:ok, %Snapshot{}} = Snapshots.delete_snapshot(snapshot)
      assert_raise Ecto.NoResultsError, fn -> Snapshots.get_snapshot!(snapshot.id) end
    end

    test "change_snapshot/1 returns a snapshot changeset" do
      snapshot = snapshot_fixture()
      assert %Ecto.Changeset{} = Snapshots.change_snapshot(snapshot)
    end
  end
end
