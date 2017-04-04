defmodule AfterGlow.SendAlertConfig do
  use AfterGlow.Web, :model
  alias AfterGlow.Alert
  import EctoEnum, only: [defenum: 2]
  
  defenum CommTypeEnum, email: 0, sms: 1, call: 2
  schema "generated_alerts" do
    belongs_to :alert, Alert
    field :message_template, :string
    field :comm_type, :integer
    field :to_addresses, {:array, :string}
    field :subject_template, :string
    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:alert_id, :message_template, :subject_template, :to_addresses, :comm_type])
    |> validate_required( [:alert_id, :message_template, :subject_template, :to_addresses, :comm_type])
  end
  
end
