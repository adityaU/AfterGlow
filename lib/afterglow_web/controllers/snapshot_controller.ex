defmodule AfterGlow.SnapshotController do
  use AfterGlow.Web, :controller

  alias AfterGlow.Snapshots
  alias AfterGlow.Snapshots.Snapshot
  alias AfterGlow.SnapshotWithDataView

  alias JaSerializer.Params

  alias AfterGlow.Plugs.Authorization
  plug(Authorization)

  action_fallback(AfterGlow.Web.FallbackController)

  def index(conn, _params) do
    snapshots = Snapshots.list_snapshots()
    render(conn, "index.json", snapshots: snapshots)
  end

  def create(conn, %{"data" => data = %{"type" => "snapshots", "attributes" => _database_params}}) do
    prms = Params.to_attributes(data)

    with {:ok, %Snapshot{} = snapshot} <- Snapshots.create_snapshot(prms) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", snapshot_path(conn, :show, snapshot))
      |> render("show.json", snapshot: snapshot)
    end
  end

  def show(conn, %{"id" => id}) do
    snapshot = Snapshots.get_snapshot!(id)

    json(
      conn,
      SnapshotWithDataView
      |> JaSerializer.format(snapshot, conn, type: 'snapshot')
    )
  end

  # def update(conn, %{"id" => id, "snapshot" => snapshot_params}) do
  #   snapshot = Snapshots.get_snapshot!(id)

  #   with {:ok, %Snapshot{} = snapshot} <- Snapshots.update_snapshot(snapshot, snapshot_params) do
  #     render(conn, "show.json", snapshot: snapshot)
  #   end
  # end

  def stop_and_new(conn, attrs) do
    snapshot = Snapshots.get_snapshot!(conn.path_params["id"])
    attrs = attrs |> Map.merge(%{"question_id" => attrs["question"]})

    with {:ok, %Snapshot{} = snapshot} <- Snapshots.stop_and_new(snapshot, attrs) do
      render(conn, "show.json", snapshot: snapshot)
    end
  end

  def delete(conn, %{"id" => id}) do
    snapshot = Snapshots.get_snapshot!(id)

    with {:ok, %Snapshot{}} <- Snapshots.delete_snapshot(snapshot) do
      send_resp(conn, :no_content, "")
    end
  end

  def find(conn, params) do
    snapshot = Snapshots.get_only_snapshot!(params["snapshot_id"])
    from_latest = params["from_latest"] == "true"

    with {:ok, data} <-
           Snapshots.find_in_snapshot(
             snapshot,
             params["column_name"],
             params["query"],
             from_latest
           ) do
      json(conn, data)
    end
  end

  def suggest(conn, params) do
    snapshot = Snapshots.get_only_snapshot!(params["snapshot_id"])
    from_latest = params["from_latest"] == "true"

    with {:ok, data} <-
           Snapshots.suggest_from_snapshot(
             snapshot,
             params["column_name"],
             params["query"],
             from_latest
           ) do
      json(conn, data)
    end
  end
end
