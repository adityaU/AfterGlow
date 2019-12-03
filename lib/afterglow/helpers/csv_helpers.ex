defmodule AfterGlow.Helpers.CsvHelpers do
  alias AfterGlow.Question

  alias AfterGlow.Sql.DbConnection
  alias AfterGlow.Settings.ApplicableSettings
  import AfterGlow.Sql.QueryRunner, only: [make_final_query: 3]
  alias ExAws.S3

  def fetch_and_upload_wrapper(db_record, params, download_limit) when is_map(params) do
    {_, query} = make_final_query(db_record, params, params[:variables])
    fetch_and_upload(db_record, query, nil, download_limit)
  end

  def fetch_and_upload_wrapper(db_record, params, file_path, download_limit)
      when is_map(params) do
    {_, query} = make_final_query(db_record, params, params[:variables])
    fetch_and_upload(db_record, query, file_path, download_limit)
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

    sign_url_if_needed(file_name, file_path)

  end

  def sign_url_if_needed(file_name, file_path) do
    bucket =ApplicableSettings.s3_bucket() || Application.get_env(:afterglow, :s3_bucket)
    if ApplicableSettings.use_signed_s3_url_in_emails() do
      S3.presigned_url(Enum.into(aws_config(), %{}) , :get, bucket, file_path || s3_file_name(file_name), [expires: ApplicableSettings.signed_s3_url_timeout])
      |> elem(1)
      |> IO.inspect(label: "Signed_URL")
    else
    "s3-#{aws_region()}.amazonaws.com/#{bucket}#{
      file_path || s3_file_name(file_name)
    }"
    |> URI.encode()
    end
  end

  def save_and_upload_from_stream(stream, columns, file_path) do
    {file_name, data_preview} = save_to_file_and_upload(stream, columns)
    url = upload_file_and_return_url(file_name, file_path)
    {url, data_preview}
  end

  defp fetch_and_upload(db_record, query, file_path, download_limit) do
    {:ok, {file_name, data_preview}} =
      DbConnection.execute_with_stream(
        db_record |> Map.from_struct(),
        query,
        download_limit,
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

  defp aws_config() do
    config = [host: "s3-#{aws_region()}.amazonaws.com", region: aws_region()]

    if ApplicableSettings.aws_access_key_id() && ApplicableSettings.aws_secret_access_key() do
      config
      |> Keyword.put(:access_key_id, ApplicableSettings.aws_access_key_id())
      |> Keyword.put(:secret_access_key, ApplicableSettings.aws_secret_access_key())
    else
      config
    end
  end

  defp upload_file(file_name, file_path) do
    file_name
    |> S3.Upload.stream_file()
    |> S3.upload(
      ApplicableSettings.s3_bucket() || Application.get_env(:afterglow, :s3_bucket),
      file_path || file_name |> s3_file_name
    )
    |> ExAws.request!(aws_config())
  end

  defp aws_region do
    ApplicableSettings.aws_region() || Application.get_env(:afterglow, :aws_region)
  end
end
