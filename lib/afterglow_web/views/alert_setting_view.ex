defmodule AfterGlow.AlertSettingView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView

  attributes([
    :name,
    :question_id,
    :column,
    :aggregation,
    :number_of_rows,
    :operation,
    :traversal,
    :is_active,
    :frequency_value_in_seconds,
    :start_time,
    :scheduled_disabled_config,
    :silent_till,
    :inserted_at,
    :updated_at
  ])

  def type do
    "alert-settings"
  end

  has_one(
    :question,
    field: :question_id,
    type: "questions"
  )

  has_many(
    :alert_level_settings,
    field: :alert_level_settings,
    type: "alert-level-settings",
    include: false
  )

  has_many(
    :alert_notification_settings,
    field: :alert_notification_settings,
    type: "alert-notification-settings",
    include: false
  )
end
