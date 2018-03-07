defmodule AfterGlow.SnapshotsTasks do
  alias AfterGlow.Snapshots
  alias AfterGlow.Repo

  def save(snapshot) do
    unless snapshot.status == "pending" do
      update_status(snapshot, "in_process")

      snapshot =
        cond do
          snapshot.should_save_data_to_db and snapshot.should_create_csv ->
            Snapshots.save_data(snapshot)
            |> Snapshots.create_and_send_csv(nil)

          snapshot.should_save_data_to_db ->
            Snapshots.save_data(snapshot)
            snapshot

          snapshot.should_create_csv ->
            Snapshots.create_and_send_csv_from_remote_db(snapshot)
            snapshot
        end

      update_status(snapshot, "success")
    end
  after
    if snapshot.scheduled do
      create_new_snapshot_and_schedule(snapshot)
    end
  end

  def schedule(snapshot, time) do
    "Scheduling #{snapshot.name} at #{time}"
    |> IO.inspect()

    :timer.apply_after(time, __MODULE__, :save, [snapshot])
  end

  def schedule_or_save(snapshot) do
    unless snapshot.status == "pending" and snapshot.starting_at do
      if snapshot.scheduled do
        schedule(snapshot, find_next_suitable_time(snapshot))
      else
        save(snapshot)
      end
    end
  end

  defp find_next_suitable_time(snapshot) do
    time =
      snapshot.starting_at
      |> convert_ecto_datetime_to_epoc()
      |> Kernel.+(snapshot.interval)

    if time
       |> Kernel.>(
         DateTime.utc_now()
         |> DateTime.to_unix(:seconds)
       ) do
      2
    else
      time
      |> Kernel.-(
        DateTime.utc_now()
        |> DateTime.to_unix(:seconds)
      )
      |> Kernel.*(1000)
    end
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
        snapshot_data: [],
        children: [],
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
