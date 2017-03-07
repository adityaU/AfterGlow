defmodule SimpleBase.DashboardView do
  use SimpleBase.Web, :view
  use JaSerializer.PhoenixView

  attributes [:title, :update_interval, :last_updated, :inserted_at, :updated_at]
  

end
