defmodule AfterGlow.CsvTasks do
  alias AfterGlow.Helpers.CsvHelpers
  alias AfterGlow.Mailers.CsvMailer
  alias AfterGlow.Sql.DbConnection
  alias AfterGlow.AuditLogs.AuditLogs
  import AfterGlow.Sql.QueryRunner, only: [permit_prms_raw_query: 2]

  def qb_fetch_and_upload(db_record, params, email, download_limit, tracking_details) do
    query = DbConnection.query_string(db_record |> Map.from_struct(), params)
    raw_fetch_and_upload(db_record, params |> permit_prms_raw_query(query), email, download_limit, tracking_details)
  end

  def raw_fetch_and_upload(db_record, params, email, download_limit, tracking_details) do
    {url, data_preview, downloaded_rows} = CsvHelpers.fetch_and_upload_wrapper(db_record, params, download_limit)
    CsvMailer.mail(email, url, data_preview)

    if tracking_details && tracking_details[:current_user] do
      AuditLogs.create_audit_log(%{
        whodunit: tracking_details[:current_user].id,
        additional_data: tracking_details |> Map.delete(:current_user) |> Map.put(:fetched_rows,  downloaded_rows),
        action: 4
      })
    end
  end
end
