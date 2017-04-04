defmodule AfterGlow.QueryView do
  use AfterGlow.Web, :view

  def render("execute.json", %{data: data, query: query}) do
    %{data: data, query: query}
  end
  def render("execute.json", %{error: error, query: query}) do
    %{error: error, query: query}
  end
end
