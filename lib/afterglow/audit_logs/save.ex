defmodule AfterGlow.AuditLogSave do
  alias AfterGlow.Repo, as: Repo
  @model AfterGlow.AuditLog

  def delete(_id) do
    {:error, :not_allowed}
  end

  def save!(user_id, table_name, action, additional_data) do
    Repo.insert!(
      @model.changeset(%@model{}, %{
        whodunit: user_id,
        table_name: table_name,
        action: action,
        additional_data: additional_data
      })
    )
  end
end

