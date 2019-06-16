defmodule AfterGlow.SnapshotsTasks do
  alias AfterGlow.Snapshots
  alias AfterGlow.Snapshots.Snapshot
  alias AfterGlow.CacheWrapper.Repo
  alias AfterGlow.Async
  import Ecto.Query

  def save(snapshot) do
    Repo.transaction(fn ->
      try do
        snapshot =
          from(s in Snapshot, where: s.id == ^snapshot.id, lock: "FOR UPDATE NOWAIT")
          |> Repo.one()

        try do
          unless snapshot.status == "pending" do
            update_status(snapshot, "in_process")

            snapshot =
              cond do
                snapshot.should_save_data_to_db and snapshot.should_create_csv ->
                  Snapshots.save_data(snapshot)
                  |> Snapshots.create_and_send_csv(nil)

                  snapshot

                snapshot.should_save_data_to_db ->
                  Snapshots.save_data(snapshot)
                  snapshot

                snapshot.should_create_csv ->
                  Snapshots.create_and_send_csv_from_remote_db(snapshot)
                  snapshot
              end

            update_status(snapshot, "success")

            if snapshot.scheduled do
              create_new_snapshot(snapshot)
            end
          end
        catch
          _ ->
            update_status(snapshot, "failed")

            if snapshot.scheduled do
              create_new_snapshot(snapshot)
            end
        end
      catch
        _ ->
          nil
      end
    end)
  end

  def run do
    from(s in Snapshot)
    |> where(
      [s],
      s.status in ["pending"] and s.starting_at <= ^DateTime.utc_now()
    )
    |> Repo.all()
    |> Enum.each(fn s ->
      Async.perform(&__MODULE__.save/1, [s])
    end)
  end

  def cancel_all_in_process_snapshots do
    from(s in Snapshot)
    |> where(
      [s],
      s.status == "in_process" and s.starting_at <= ^DateTime.utc_now()
    )
    |> Repo.all()
    |> Enum.map(fn s -> update_status(s, "pending") end)
  end

  defp change_attributes(snapshot) do
    parent =
      if snapshot.parent do
        snapshot.parent
      else
        snapshot
      end

    children_count =
      Repo.one(from(s in Snapshot, where: s.parent_id == ^parent.id, select: count("*")))

    name = "#{parent.name}-#{children_count |> Kernel.+(1)}"

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
          |> DateTime.from_unix!(:second)
    }
  end

  defp create_new_snapshot(snapshot) do
    # clone
    {:ok, snapshot} =
      snapshot
      |> Repo.preload(:question)
      |> Repo.preload(:parent)
      |> Repo.preload(:children)
      |> Repo.preload(:snapshot_data)
      |> change_attributes
      |> Map.put(:id, nil)
      |> Repo.insert_with_cache()

    # schedule
    # snapshot
    # |> schedule(
    #   snapshot.starting_at
    #   |> convert_ecto_datetime_to_epoc
    #   |> Kernel.-(
    #     DateTime.utc_now()
    #     |> DateTime.to_unix(:seconds)
    #   )
    #   |> Kernel.*(1000)
    # )
  end

  defp update_status(snapshot, status) do
    snapshot = Ecto.Changeset.change(snapshot, status: status)
    Repo.update!(snapshot)
  end

  defp convert_ecto_datetime_to_epoc(datetime) do
    datetime
    |> NaiveDateTime.to_erl()
    |> :calendar.datetime_to_gregorian_seconds()
    |> Kernel.-(62_167_219_200)
  end
end
