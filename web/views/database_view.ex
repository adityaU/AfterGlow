defmodule AfterGlow.DatabaseView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView

  attributes [:name, :db_url, :inserted_at, :updated_at, :last_accessed_at]
  
  has_many :tables,
    field: :tables,
    type: "table",
    include: false

  def render("test_connection.json", %{"success" => true}) do
    %{success: true}
  end
  def render("test_connection.json", %{"error" => error, "success" => false}) do
    %{error: error, success: false}
  end
end
