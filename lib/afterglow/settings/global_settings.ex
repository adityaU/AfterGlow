defmodule AfterGlow.Settings.GlobalSetting do
  use AfterGlow.Web, :model

  @cast_params [:name, :value]
  @required_params @cast_params -- [:value]

  schema "settings" do
    field(:name, :string, null: false)
    field(:value, :string)
    timestamps()
  end

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @cast_params)
    |> validate_required(@required_params)
  end
end
