defmodule AfterGlowWeb.SnapshotControllerTest do
  use AfterGlowWeb.ConnCase

  alias AfterGlow.Snapshots
  alias AfterGlow.Snapshots.Snapshot

  @create_attrs %{columns: [], name: "some name"}
  @update_attrs %{columns: [], name: "some updated name"}
  @invalid_attrs %{columns: nil, name: nil}

  def fixture(:snapshot) do
    {:ok, snapshot} = Snapshots.create_snapshot(@create_attrs)
    snapshot
  end

  setup %{conn: conn} do
    {:ok, conn: put_req_header(conn, "accept", "application/json")}
  end

  describe "index" do
    test "lists all snapshots", %{conn: conn} do
      conn = get conn, snapshot_path(conn, :index)
      assert json_response(conn, 200)["data"] == []
    end
  end

  describe "create snapshot" do
    test "renders snapshot when data is valid", %{conn: conn} do
      conn = post conn, snapshot_path(conn, :create), snapshot: @create_attrs
      assert %{"id" => id} = json_response(conn, 201)["data"]

      conn = get conn, snapshot_path(conn, :show, id)
      assert json_response(conn, 200)["data"] == %{
        "id" => id,
        "columns" => [],
        "name" => "some name"}
    end

    test "renders errors when data is invalid", %{conn: conn} do
      conn = post conn, snapshot_path(conn, :create), snapshot: @invalid_attrs
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "update snapshot" do
    setup [:create_snapshot]

    test "renders snapshot when data is valid", %{conn: conn, snapshot: %Snapshot{id: id} = snapshot} do
      conn = put conn, snapshot_path(conn, :update, snapshot), snapshot: @update_attrs
      assert %{"id" => ^id} = json_response(conn, 200)["data"]

      conn = get conn, snapshot_path(conn, :show, id)
      assert json_response(conn, 200)["data"] == %{
        "id" => id,
        "columns" => [],
        "name" => "some updated name"}
    end

    test "renders errors when data is invalid", %{conn: conn, snapshot: snapshot} do
      conn = put conn, snapshot_path(conn, :update, snapshot), snapshot: @invalid_attrs
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "delete snapshot" do
    setup [:create_snapshot]

    test "deletes chosen snapshot", %{conn: conn, snapshot: snapshot} do
      conn = delete conn, snapshot_path(conn, :delete, snapshot)
      assert response(conn, 204)
      assert_error_sent 404, fn ->
        get conn, snapshot_path(conn, :show, snapshot)
      end
    end
  end

  defp create_snapshot(_) do
    snapshot = fixture(:snapshot)
    {:ok, snapshot: snapshot}
  end
end
