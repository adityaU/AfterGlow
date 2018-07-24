require IEx

defmodule AfterGlow.Snapshots do
  @moduledoc """
  The Snapshots context.
  """

  import Ecto.Query, warn: false
  alias AfterGlow.CacheWrapper.Repo

  alias AfterGlow.Snapshots.Snapshot
  alias AfterGlow.Snapshots.SnapshotData
  alias AfterGlow.Database
  alias AfterGlow.Question
  alias AfterGlow.Sql.DConnection
  alias AfterGlow.Async
  alias AfterGlow.SnapshotsTasks
  alias AfterGlow.Helpers.CsvHelpers
  alias AfterGlow.Mailers.CsvMailer
  alias AfterGlow.Mailers.SnapshotMailer
  import Ecto.Query, only: [from: 2]

  @doc """
  Returns the list of snapshots.

  ## Examples

  iex> list_snapshots()
  [%Snapshot{}, ...]

  """
  def list_snapshots do
    Repo.all(Snapshot)
  end

  @doc """
  Gets a single snapshot.

  Raises `Ecto.NoResultsError` if the Snapshot does not exist.

  ## Examples

  iex> get_snapshot!(123)
  %Snapshot{}

  iex> get_snapshot!(456)
  ** (Ecto.NoResultsError)

  """
  def get_snapshot!(id) do
    snapshot_data_preload_query = from(c in SnapshotData, limit: 2000)

    Repo.get!(Snapshot, id)
    |> Repo.preload(snapshot_data: snapshot_data_preload_query)
  end

  @doc """
  Creates a snapshot.

  ## Examples

  iex> create_snapshot(%{field: value})
  {:ok, %Snapshot{}}

  iex> create_snapshot(%{field: bad_value})
  {:error, %Ecto.Changeset{}}

  """
  def create_snapshot(attrs \\ %{}) do
    attrs = attrs |> set_pending_status

    created =
      %Snapshot{}
      |> Snapshot.changeset(attrs)
      |> Repo.insert_with_cache()

    with {:ok, %Snapshot{} = snapshot} <- created do
      Async.perform(&SnapshotsTasks.save/1, [snapshot])
    end

    created
  end

  @doc """
  Updates a snapshot.

  ## Examples

  iex> update_snapshot(snapshot, %{field: new_value})
  {:ok, %Snapshot{}}

  iex> update_snapshot(snapshot, %{field: bad_value})
  {:error, %Ecto.Changeset{}}

  """
  def update_snapshot(%Snapshot{} = snapshot, attrs) do
    snapshot
    |> Snapshot.changeset(attrs)
    |> Repo.update!()
  end

  @doc """
  Deletes a Snapshot.

  ## Examples

  iex> delete_snapshot(snapshot)
  {:ok, %Snapshot{}}

  iex> delete_snapshot(snapshot)
  {:error, %Ecto.Changeset{}}

  """
  def delete_snapshot(%Snapshot{} = snapshot) do
    Repo.delete_with_cache(snapshot)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking snapshot changes.

  ## Examples

  iex> change_snapshot(snapshot)
  %Ecto.Changeset{source: %Snapshot{}}

  """
  def change_snapshot(%Snapshot{} = snapshot) do
    Snapshot.changeset(snapshot, %{})
  end

  def stop_and_new(%Snapshot{} = snapshot, attrs) do
    delete_snapshot(snapshot)
    create_snapshot(attrs)
  end

  def save_data(%Snapshot{} = snapshot) do
    snapshot = snapshot |> Repo.preload(:question)
    question = snapshot.question |> Repo.preload(:variables)
    db_identifier = question.human_sql["database"]["unique_identifier"]
    db_record = Repo.one(from(d in Database, where: d.unique_identifier == ^db_identifier))

    query =
      Question.replace_variables(question.sql, question.variables, question.variables, snapshot)

    {:ok, snapshot} =
      DbConnection.execute_with_stream(
        db_record |> Map.from_struct(),
        query,
        &insert_snapshot_data_in_bulk(snapshot, &1, &2)
      )

    snapshot_link =
      "#{Application.get_env(:afterglow, :app_root)}questions/#{snapshot.question_id}/snapshots/#{
        snapshot.id
      }"

    SnapshotMailer.mail(snapshot.mail_to, snapshot, snapshot_link)
    snapshot
  end

  def fetch_and_upload_for_snapshot(id, email_id) do
    snapshot =
      Repo.get!(Snapshot, id)
      |> Repo.preload(:question)

    Async.perform(&create_and_send_csv/2, [snapshot, email_id])
  end

  def create_and_send_csv_from_remote_db(snapshot) do
    snapshot = snapshot |> Repo.preload(:question)
    db_identifier = snapshot.question.human_sql["database"]["unique_identifier"]
    db_record = Repo.one(from(d in Database, where: d.unique_identifier == ^db_identifier))
    variables = (snapshot.question |> Repo.preload(:variables)).variables

    query = Question.replace_variables(snapshot.question.sql, variables, variables, snapshot)
    params = %{raw_query: query, variables: variables}

    {url, data_preview} =
      CsvHelpers.fetch_and_upload_wrapper(
        db_record,
        params,
        file_path(snapshot)
      )

    CsvMailer.mail(snapshot.mail_to, url, csv_subject(snapshot), data_preview)
  end

  def create_and_send_csv(id) when is_integer(id) do
    snapshot = Snapshot |> Repo.get!(id)
    create_and_send_csv(snapshot)
  end

  def create_and_send_csv(snapshot, email_id) do
    query =
      from(
        sd in SnapshotData,
        select: sd.row,
        where: sd.snapshot_id == ^snapshot.id
      )

    stream = Repo.stream(query, timeout: 15_000_000)

    {:ok, url} =
      Repo.transaction(fn ->
        stream = stream |> Stream.map(fn x -> x["values"] end)
        CsvHelpers.save_and_upload_from_stream([stream], snapshot.columns, file_path(snapshot))
      end)

    CsvMailer.mail(email_id || snapshot.mail_to, url, csv_subject(snapshot))
  end

  defp csv_subject(snapshot) do
    "Please Download CSV for Snapshot: #{snapshot.name}"
  end

  defp set_pending_status(attrs) do
    attrs |> Map.put("status", "pending")
  end

  defp file_path(snapshot) do
    if snapshot.scheduled do
      "/afterglow/questions/question-#{snapshot.question.id}/snapshots/snapshot-#{
        snapshot.parent_id || snapshot.id
      }/#{snapshot.starting_at}.csv"
    else
      "/afterglow/questions/question-#{snapshot.question.id}/snapshots/snapshot-#{
        snapshot.parent_id || snapshot.id
      }/#{SecureRandom.uuid()}.csv"
    end
  end

  defp insert_snapshot_data_in_bulk(snapshot, rows, columns) do
    snapshot = update_snapshot(snapshot, %{"columns" => columns})
    query = "insert into snapshot_data (snapshot_id, row, inserted_at, updated_at) values"
    time_string = Ecto.DateTime.utc() |> Ecto.DateTime.to_string()

    rows
    |> Enum.map(fn chunk ->
      values =
        chunk
        |> Enum.map(fn x ->
          value = Jason.encode!(%{values: x}) |> String.replace("'", "''")
          "( #{snapshot.id}, '#{value}', '#{time_string}', '#{time_string}' )"
        end)
        |> Enum.join(", ")

      if values |> String.first() do
        query = query <> values
        Ecto.Adapters.SQL.query!(Repo, query, [])
      end
    end)

    snapshot
  end
end
