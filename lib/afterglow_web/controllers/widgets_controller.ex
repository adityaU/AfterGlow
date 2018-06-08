defmodule AfterGlow.WidgetController do
  use AfterGlow.Web, :controller

  alias AfterGlow.Widgets
  alias AfterGlow.Widgets.Widget
  alias AfterGlow.WidgetView

  alias JaSerializer.Params

  alias AfterGlow.Plugs.Authorization
  plug(Authorization)

  action_fallback(AfterGlow.Web.FallbackController)

  def index(conn, %{"query" => query}) do
    widgets = Widgets.list_widgets(query)
    render(conn, "index.json", widgets: widgets)
  end

  def index(conn, %{"filter" => %{"id" => ids}}) do
    ids = ids |> String.split(",")
    widgets = Widgets.list_widgets(ids)
    render(conn, "index.json", widgets: widgets)
  end

  def create(conn, %{"data" => data = %{"type" => "widgets", "attributes" => _params}}) do
    prms = Params.to_attributes(data)

    with {:ok, %Widget{} = widget} <- Widgets.create_widget(prms) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", widget_path(conn, :show, widget))
      |> render("show.json", widget: widget |> Repo.preload(:widget_items))
    end
  end

  def show(conn, %{"id" => id}) do
    widget = Widgets.get_widget!(id)

    json(
      conn,
      WidgetView
      |> JaSerializer.format(widget, conn, type: 'widget')
    )
  end

  def update(conn, %{"id" => id, "data" => data = %{"type" => "widgets", "attributes" => _params}}) do
    widget = Widgets.get_widget!(id)
    prms = Params.to_attributes(data)

    with {:ok, %Widget{} = widget} <-
           Widgets.update_widget(
             widget
             |> Repo.preload(:widget_items),
             prms
           ) do
      render(conn, "show.json", widget: widget)
    end
  end

  def delete(conn, %{"id" => id}) do
    widget = Widgets.get_widget!(id)

    with {:ok, %Widget{}} <- Widgets.delete_widget(widget) do
      send_resp(conn, :no_content, "")
    end
  end
end
