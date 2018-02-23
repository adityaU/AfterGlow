defmodule AfterGlow.Helpers.CsvHelpers  do
  alias AfterGlow.Question
  alias AfterGlow.Sql.DbConnection
  alias ExAws.S3

  def fetch_and_upload(db_record, params) do
    query = DbConnection.query_string(db_record |> Map.from_struct, params )
    fetch_and_upload_and_send_mail(db_record, query)
  end
  
  def fetch_and_upload(db_record, sql, variables) do
    query = Question.replace_variables(sql, variables, variables)
    fetch_and_upload_and_send_mail(db_record, query)
  end


  def save_to_file_and_upload(stream, columns) do
    file_name = "/tmp/#{SecureRandom.uuid}.csv"
    file = File.open!(file_name |> IO.inspect, [:write, :utf8])
    [columns]
    |> CSV.encode
    |> Enum.each(&IO.write(file, &1))
    stream |> Enum.each(fn row ->
      row
      |> CSV.encode
      |> Enum.each(&IO.write(file, &1))
    end)
    file |> File.close
    upload_file(file_name)
    delete_file(file_name)
    "s3-#{aws_region}.amazonaws.com/#{Application.get_env(:afterglow, :s3_bucket)}#{s3_file_name(file_name)}"
  end

  defp fetch_and_upload_and_send_mail(db_record, query) do
    {:ok, url} = DbConnection.execute_with_stream(db_record |> Map.from_struct, query, &save_to_file_and_upload/2 )
    url
  end

  defp delete_file(file_name) do
    file_name |> File.rm
  end

  defp s3_file_name(file_name) do
    file_name
    |> String.replace("/tmp/", "/afterglow/uploads/")
  end


  defp upload_file(file_name) do
    file_name
    |> S3.Upload.stream_file
    |> S3.upload(Application.get_env(:afterglow, :s3_bucket), file_name |> s3_file_name)
    |> ExAws.request!(host: "s3-#{aws_region}.amazonaws.com", region: aws_region)
  end


  defp aws_region do
    aws_region = Application.get_env(:afterglow, :aws_region)
  end
end
