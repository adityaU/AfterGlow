defmodule AfterGlow.DataFilesController do
  use AfterGlow.Web, :controller
  alias AfterGlow.Repo
  alias AfterGlow.Database
  alias AfterGlow.Async
  alias AfterGlow.CsvTasks
  alias AfterGlow.Snapshots

  alias AfterGlow.Plugs.Authorization
  plug(Authorization)

  def fetch_and_upload(conn, %{"snapshot_id" => id}) do
    Snapshots.fetch_and_upload_for_snapshot(id, conn.assigns.current_user.email)
    json(conn, %{success: true})
  end

  def fetch_and_upload(conn, params) do
    db_identifier = params["database"]["unique_identifier"]
    db_record = Repo.one(from(d in Database, where: d.unique_identifier == ^db_identifier))

    case params["queryType"] do
      "query_builder" ->
        Async.perform(&CsvTasks.fetch_and_upload/3, [
          db_record,
          permit_params(params),
          conn.assigns.current_user.email
        ])

      "raw" ->
        Async.perform(&CsvTasks.fetch_and_upload/4, [
          db_record,
          params["rawQuery"],
          params["variables"],
          conn.assigns.current_user.email
        ])
    end

    json(conn, %{success: true})
  end

  defp permit_params(params) do
    %{
      database: params["database"],
      table: params["table"],
      selects: params["views"] |> Enum.map(fn x -> x["selected"] end),
      group_bys:
        params["groupBys"] |> Enum.map(fn x -> [x["selected"], x["castType"]["value"]] end),
      filters: params["filters"],
      order_bys: params["orderBys"],
      limit: params["limit"],
      offset: params["offset"]
    }
  end
end
