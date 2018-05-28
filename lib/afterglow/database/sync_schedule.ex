defmodule AfterGlow.Database.SyncSchedule do
  alias AfterGlow.Database
  alias AfterGlow.Async
  alias AfterGlow.SchemaTasks
  alias AfterGlow.Repo

  def sync do
    Database
    |> Repo.all()
    |> Enum.map(fn d ->
      Async.perform(&SchemaTasks.sync/1, [d])
    end)
  end
end
