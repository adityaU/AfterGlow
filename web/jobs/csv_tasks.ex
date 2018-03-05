defmodule AfterGlow.CsvTasks do
  alias AfterGlow.Repo
  alias AfterGlow.Helpers.CsvHelpers
  alias AfterGlow.Mailers.CsvMailer

  def fetch_and_upload(db_record, params, email) do
    url = CsvHelpers.fetch_and_upload_wrapper(db_record, params)
    CsvMailer.mail(email, url)
  end

  def fetch_and_upload(db_record, sql, variables, email) do
    url = CsvHelpers.fetch_and_upload_wrapper(db_record, sql, variables) 
    CsvMailer.mail(email, url)
  end
end
