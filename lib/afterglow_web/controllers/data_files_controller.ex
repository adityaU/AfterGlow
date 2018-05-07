defmodule AfterGlow.DataFilesController do
  use AfterGlow.Web, :controller
  alias AfterGlow.Repo
  alias AfterGlow.Database
  alias AfterGlow.Async
  alias AfterGlow.CsvTasks
  alias AfterGlow.Snapshots

  alias AfterGlow.Plugs.Authorization
  import AfterGlow.Sql.QueryRunner, only: [permit_params: 1, permit_prms_raw_query: 2]
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
        Async.perform(&CsvTasks.qb_fetch_and_upload/3, [
          db_record,
          permit_params(params),
          conn.assigns.current_user.email
        ])

      "raw" ->
        Async.perform(&CsvTasks.raw_fetch_and_upload/3, [
          db_record,
          params |> permit_params |> permit_prms_raw_query(params["rawQuery"]),
          conn.assigns.current_user.email
        ])
    end

    json(conn, %{success: true})
  end
end
