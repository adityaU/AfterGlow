defmodule AfterGlow.PageController do
  use AfterGlow.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
