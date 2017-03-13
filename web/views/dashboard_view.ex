defmodule SimpleBase.DashboardView do
  use SimpleBase.Web, :view
  use JaSerializer.PhoenixView

  attributes [:title, :description, :settings, :update_interval, :last_updated, :inserted_at, :updated_at]
  
  has_many :questions,
    field: :questions,
    type: "questions",
    include: false

  def settings(dashboard, _conn) do
    dashboard.settings || %{gridSettings: %{}}
  end
end
