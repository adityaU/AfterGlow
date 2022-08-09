defmodule AfterGlow.AuditLogs.AuditLogs do
  alias AfterGlow.AuditLogs.AuditLog
  alias AfterGlow.CacheWrapper.Repo

  def create_audit_log(attrs \\ %{}) do
    %AuditLog{}
    |> AuditLog.changeset(attrs)
    |> Repo.insert!()
  end
end


