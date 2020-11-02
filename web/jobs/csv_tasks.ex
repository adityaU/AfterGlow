defmodule AfterGlow.CsvTasks do
  alias AfterGlow.Repo
  alias AfterGlow.Helpers.CsvHelpers
  alias AfterGlow.Mailers.CsvMailer
  alias AfterGlow.Sql.DbConnection
  alias AfterGlow.AuditLogSave
  alias AfterGlow.User
  alias AfterGlow.Actions

  import AfterGlow.Sql.QueryRunner, only: [permit_prms_raw_query: 2]

  def qb_fetch_and_upload(db_record, params, email, download_limit) do
    query = DbConnection.query_string(db_record |> Map.from_struct(), params)
    raw_fetch_and_upload(db_record, params |> permit_prms_raw_query(query), email, download_limit)
  end

  def raw_fetch_and_upload(db_record, params, email, download_limit) do
    {url, data_preview} = CsvHelpers.fetch_and_upload_wrapper(db_record, params, download_limit)
    CsvMailer.mail(email, url, data_preview)

    # extract table name from params
    table = params[:table]
    table_name = table["readable_table_name"]

    # Get user id from email
    user = Repo.get_by(User, email: email)
    AuditLogSave.save!(
          user.id,
          table_name,
          Actions.enum[:download],
          %{ "task" => "download_csv", "email" => email, "s3_url" => url }
        )
  end
end
