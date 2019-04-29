defmodule AfterGlow.UserStrippedView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView

  def type do
    "user"
  end

  attributes([
    :first_name,
    :last_name,
    :full_name,
    :email,
    :profile_pic,
    :is_deactivated
  ])
end
