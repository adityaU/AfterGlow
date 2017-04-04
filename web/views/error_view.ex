defmodule AfterGlow.ErrorView do
  use AfterGlow.Web, :view

  def render("403.json", message) do
   %{error: message} 
  end

  def render("500.html", _assigns) do
    "Internal server error"
  end

  # In case no render clause matches or no
  # template is found, let's render it as 500
  def template_not_found(_template, assigns) do
    render "500.html", assigns
  end
end
