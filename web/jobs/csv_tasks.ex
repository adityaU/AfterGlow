defmodule AfterGlow.CsvTasks do
  alias AfterGlow.Repo
  alias AfterGlow.Helpers.CsvHelpers
  alias AfterGlow.Mailers.CsvMailer
  alias AfterGlow.Sql.DbConnection
  import AfterGlow.Sql.QueryRunner, only: [permit_prms_raw_query: 2]

  def qb_fetch_and_upload(db_record, params, email, download_limit) do
    query = DbConnection.query_string(db_record |> Map.from_struct(), params)
    raw_fetch_and_upload(db_record, params |> permit_prms_raw_query(query), email, download_limit)
  end

  def raw_fetch_and_upload(db_record, params, email, download_limit) do
    {url, data_preview} = CsvHelpers.fetch_and_upload_wrapper(db_record, params, download_limit)
    CsvMailer.mail(email, url, data_preview)
  end
end
