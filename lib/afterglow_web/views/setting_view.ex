defmodule AfterGlow.SettingView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView

  attributes([
    :name,
    :value,
    :inserted_at,
    :updated_at
  ])
end
