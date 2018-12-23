defmodule AfterGlow.ApiActions.ApiActionLogs do
  alias AfterGlow.ApiActions.ApiActionLog
  alias AfterGlow.Repo

  def save(log_args) do
    ApiActionLog.changeset(%ApiActionLog{}, log_args)
    |> Repo.insert()
  end
end
