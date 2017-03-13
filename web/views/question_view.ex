defmodule SimpleBase.QuestionView do
  use SimpleBase.Web, :view
  use JaSerializer.PhoenixView

  attributes [:title, :last_updated, :sql, :human_sql, :results_view_settings, :inserted_at, :updated_at, :shareable_link, :is_shareable_link_public, :query_type]

  has_many :dashboards,
    field: :dashboards,
    type: "dashboards",
    include: false
  

end
