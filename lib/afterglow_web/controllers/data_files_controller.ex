defmodule AfterGlow.DataFilesController do
  use AfterGlow.Web, :controller
  alias AfterGlow.Repo
  alias AfterGlow.Database
  alias AfterGlow.Async
  alias AfterGlow.CsvTasks
  alias AfterGlow.Snapshots

  alias AfterGlow.Plugs.Authorization
  alias AfterGlow.Settings.ApplicableSettings
  import AfterGlow.Sql.QueryRunner, only: [permit_params: 1, permit_prms_raw_query: 2]
  plug(Authorization)

  def fetch_and_upload(conn, %{"snapshot_id" => id}) do
    Snapshots.fetch_and_upload_for_snapshot(
      id,
      conn.assigns.current_user.email,
      download_limit(conn.assigns.current_user)
    )

    json(conn, %{success: true})
  end

  def fetch_and_upload(conn, params) do
    db_identifier = params["database"]["unique_identifier"]
    db_record = Repo.one(from(d in Database, where: d.unique_identifier == ^db_identifier))

    download_limit = download_limit(conn.assigns.current_user)

    case params["queryType"] do
      "query_builder" ->
        tracking_details =
          %{current_user: conn.assigns.current_user, download_limit: download_limit}
          |> Map.merge(permit_params(params))

        Async.perform(&CsvTasks.qb_fetch_and_upload/5, [
          db_record,
          permit_params(params),
          conn.assigns.current_user,
          download_limit(conn.assigns.current_user),
          tracking_details
        ])

      "raw" ->
        tracking_details =
          %{current_user: conn.assigns.current_user, download_limit: download_limit}
          |> Map.merge(permit_params(params) |> permit_prms_raw_query(params["rawQuery"]))

        Async.perform(&CsvTasks.raw_fetch_and_upload/5, [
          db_record,
          params |> permit_params |> permit_prms_raw_query(params["rawQuery"]),
          conn.assigns.current_user.email,
          download_limit(conn.assigns.current_user),
          tracking_details
        ])
    end

    json(conn, %{success: true})
  end

  defp download_limit(user) do
    ApplicableSettings.max_download_limit(user)
  end
end
