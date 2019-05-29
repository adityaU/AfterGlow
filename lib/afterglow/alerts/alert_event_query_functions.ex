defmodule AfterGlow.Alerts.AlertEventQueryFunctions do
  @model AfterGlow.Alerts.AlertEvent
  @default_preloads []
  use AfterGlow.Utils.Models.Crud

  def get_last(alert_setting_id) do
    from(m in @model,
      where: m.alert_setting_id == ^alert_setting_id,
      order_by: [desc: :inserted_at],
      limit: 1
    )
    |> Repo.one()
  end
end
