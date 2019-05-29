defmodule AfterGlow.Alerts.AlertEventsTransformedDataQueryFunctions do
  @model AfterGlow.Alerts.AlertEventsTransformedData
  @default_preloads []
  use AfterGlow.Utils.Models.Crud

  def insert_bulk(list) do
    list
    |> Repo.insert_all(@model)
  end
end
