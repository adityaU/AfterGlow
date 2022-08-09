defmodule AfterGlow.AuditLogs.AuditLog do
  use Ecto.Schema
  alias Ecto.Changeset
  alias AfterGlow.User
  import EctoEnum

  @cast_params [
    :whodunit,
    :action,
    :additional_data,
    :action
  ]

  @required_params @cast_params

  defenum(ActionEnum,
    query: 1,
    user_operations: 2,
    settings_operations: 3,
    emails: 4
  )

  schema("audit_logs") do
    field(:whodunit, :integer)
    field(:action, ActionEnum)
    field(:additional_data, :map)
    timestamps()
  end

  def changeset(%__MODULE__{} = struct, attrs) do
    struct
    |> Changeset.cast(attrs, @cast_params)
    |> Changeset.validate_required(@required_params)
  end
end
