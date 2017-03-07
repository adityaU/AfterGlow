defmodule SimpleBase.QuestionView do
  use SimpleBase.Web, :view
  use JaSerializer.PhoenixView

  attributes [:title, :update_interval, :last_updated, :sql, :human_sql, :inserted_at, :updated_at]
  

end
