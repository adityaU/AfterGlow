defmodule AfterGlow.Helpers.CsvHelpers do
  alias AfterGlow.Question
  alias AfterGlow.Sql.DbConnection
  import AfterGlow.Sql.QueryRunner, only: [make_final_query: 3]
  alias ExAws.S3

  def fetch_and_upload_wrapper(db_record, params) when is_map(params) do
    {_, query} = make_final_query(db_record, params, params[:variables])
    fetch_and_upload(db_record, query, nil)
  end

  def fetch_and_upload_wrapper(db_record, params, file_path) when is_map(params) do
    {_, query} = make_final_query(db_record, params, params[:variables])
    fetch_and_upload(db_record, query, file_path)
  end

  def save_to_file_and_upload(stream, columns) do
    file_name = "/tmp/#{SecureRandom.uuid()}.csv"
    file = File.open!(file_name, [:write, :utf8])

    [columns]
    |> CSV.encode()
    |> Enum.each(&IO.write(file, &1))

    stream
    |> Enum.each(fn row ->
      row
      |> CSV.encode()
      |> Enum.each(&IO.write(file, &1))
    end)

    data_preview =
      [columns]
      |> Kernel.++(get_preview_rows(stream))

    file |> File.close()
    {file_name, data_preview}
  end

  def get_preview_rows(stream) do
    preview = stream |> Enum.at(0) |> Enum.take(50) |> Enum.to_list()

    unless preview |> Enum.at(0) do
      preview = stream |> Enum.at(1) |> Enum.take(50) |> Enum.to_list()
    end

    preview
  end

  def upload_file_and_return_url(file_name, file_path) do
    upload_file(file_name, file_path)
    delete_file(file_name)

    "s3-#{aws_region()}.amazonaws.com/#{Application.get_env(:afterglow, :s3_bucket)}#{
      file_path || s3_file_name(file_name)
    }"
    |> URI.encode()
  end

  def save_and_upload_from_stream(stream, columns, file_path) do
    {file_name, _} = save_to_file_and_upload(stream, columns)
    upload_file_and_return_url(file_name, file_path)
  end

  defp fetch_and_upload(db_record, query, file_path) do
    {:ok, {file_name, data_preview}} =
      DbConnection.execute_with_stream(
        db_record |> Map.from_struct(),
        query,
        &save_to_file_and_upload/2
      )

    url = upload_file_and_return_url(file_name, file_path)
    {url, data_preview}
  end

  defp delete_file(file_name) do
    file_name |> File.rm()
  end

  defp s3_file_name(file_name) do
    file_name
    |> String.replace("/tmp/", "/afterglow/uploads/")
  end

  defp upload_file(file_name, file_path) do
    file_name
    |> S3.Upload.stream_file()
    |> S3.upload(
      Application.get_env(:afterglow, :s3_bucket),
      file_path || file_name |> s3_file_name
    )
    |> ExAws.request!(host: "s3-#{aws_region()}.amazonaws.com", region: aws_region())
  end

  defp aws_region do
    Application.get_env(:afterglow, :aws_region)
  end
end
