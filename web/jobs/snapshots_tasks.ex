defmodule AfterGlow.SnapshotsTasks do
  alias AfterGlow.Snapshots
  alias AfterGlow.Repo

  def save(snapshot, scheduled) do
    unless snapshot.status == 'pending' do
      if scheduled do
        create_new_snapshot_and_schedule(snapshot)
      end

      update_status(snapshot, "in_process")

      cond do
        snapshot.should_save_data_to_db and snapshot.should_create_csv ->
          snapshot = Snapshots.save_data(snapshot)
          Snapshots.create_and_send_csv(snapshot, nil)

        snapshot.should_save_data_to_db ->
          Snapshots.save_data(snapshot)

        snapshot.should_create_csv ->
          Snapshots.create_and_send_csv_from_remote_db(snapshot)
      end

      update_status(snapshot, "success")
    end
  end

  def schedule(snapshot, time) do
    :timer.apply_after(time, __MODULE__, :save, [snapshot, true])
  end

  def schedule_or_save(snapshot) do
    save(snapshot, snapshot.scheduled)
  end

  defp change_attributes(snapshot) do
    parent =
      if snapshot.parent do
        snapshot.parent
      else
        snapshot
      end

    name = "#{parent.name}-#{snapshot.children |> length |> Kernel.+(1)}"

    %{
      snapshot
      | parent_id: parent.id,
        name: name,
        status: "pending",
        starting_at:
          snapshot.starting_at
          |> convert_ecto_datetime_to_epoc
          |> Kernel.+(snapshot.interval)
          |> Ecto.DateTime.from_unix!(:seconds)
    }
  end

  defp create_new_snapshot_and_schedule(snapshot) do
    # clone
    {:ok, snapshot} =
      snapshot
      |> Repo.preload(:question)
      |> Repo.preload(:parent)
      |> Repo.preload(:children)
      |> Repo.preload(:snapshot_data)
      |> change_attributes
      |> Map.delete(:id)
      |> Repo.insert()

    # schedule
    snapshot
    |> schedule(
      snapshot.starting_at
      |> convert_ecto_datetime_to_epoc
      |> Kernel.+(snapshot.interval)
      |> Kernel.-(
        DateTime.utc_now()
        |> DateTime.to_unix(:seconds)
      )
      |> Kernel.*(1000)
    )
  end

  defp update_status(snapshot, status) do
    snapshot = Ecto.Changeset.change(snapshot, status: status)
    Repo.update!(snapshot)
  end

  defp convert_ecto_datetime_to_epoc(datetime) do
    datetime
    |> Ecto.DateTime.to_erl()
    |> :calendar.datetime_to_gregorian_seconds()
    |> Kernel.-(62_167_219_200)
  end
end
