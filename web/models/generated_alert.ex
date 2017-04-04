defmodule AfterGlow.GeneratedAlert do
  use AfterGlow.Web, :model
  alias AfterGlow.Alert
  import EctoEnum, only: [defenum: 2]
  
  defenum StatusEnum, recovered: 0, warning: 1, critical: 2
  schema "generated_alerts" do
    belongs_to :alert , Alert
    field :status, StatusEnum
    field :failing_conditions, {:array, :map} 
    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:status, :alert_id, :failing_conditions])
    |> validate_required([:status, :alert_id, :failing_conditions])
  end
end
