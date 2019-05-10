defmodule AfterGlow.Alerts.AlertNotificationSetting do
  use Ecto.Schema
  alias Ecto.Changeset
  alias AfterGlow.Alerts.AlertSetting
  import EctoEnum

  @cast_params [:method, :recipients, :alert_setting_id]

  @required_params @cast_params

  defenum(MethodEnum,
    email: 1
  )

  schema("alert_notification_settings") do
    field(:method, MethodEnum, default: :email)
    field(:recipients, {:array, :string})
    belongs_to(:alert_setting, AlertSetting)
    timestamps()
  end

  def changeset(%__MODULE__{} = struct, attrs) do
    struct
    |> Changeset.cast(attrs, @cast_params)
    |> Changeset.validate_required(@required_params)
  end
end
