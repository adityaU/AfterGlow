defmodule SimpleBase.PageController do
  use SimpleBase.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
