defmodule AfterGlow.SnapshotScheduler do
  alias AfterGlow.Snapshots.Snapshot
  alias AfterGlow.SnapshotsTasks
  alias AfterGlow.Repo
  import Ecto.Query, only: [from: 2]

  def schedule do
    update_all_in_process_tasks_as_pending()
    schedule_all_pending_tasks()
  end

  defp update_all_in_process_tasks_as_pending do
    from(s in Snapshot, where: s.status == "in_process")
    |> Repo.update_all(set: [status: "pending"])
  end

  defp schedule_all_pending_tasks do
    from(s in Snapshot, where: s.status == "pending")
    |> Repo.all()
    |> Enum.each(fn snapshot ->
      Task.async(fn ->
        SnapshotsTasks.schedule_or_save(snapshot)
      end)
    end)
  end
end
