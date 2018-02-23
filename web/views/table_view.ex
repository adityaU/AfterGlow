defmodule AfterGlow.TableView do
  use AfterGlow.Web, :view
  use JaSerializer.PhoenixView
  alias Phoenix.Naming  

  attributes [:name, :inserted_at, :updated_at, :description, :readable_table_name, :human_name]
  has_many :columns,
    field: :columns,
    type: "column"
  has_one :database,
    field: :database_id,
    type: "database"

  def human_name(table, _conn) do
    table.readable_table_name |> Naming.humanize 
  end

end
