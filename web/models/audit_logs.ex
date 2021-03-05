defmodule AfterGlow.AuditLog do
  use AfterGlow.Web, :model
  use Ecto.Schema
  import Ecto.Changeset

  @cast_params [:whodunit, :table_name, :action, :additional_data]
  @required_params [:whodunit]
  schema "audit_logs" do
    field(:whodunit, :integer)
    field(:table_name, :string)
    field(:action, :integer)
    field(:additional_data, :map)
    timestamps(inserted_at: :inserted_at)
  end

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @cast_params)
    |> validate_required(@required_params)
  end
end
