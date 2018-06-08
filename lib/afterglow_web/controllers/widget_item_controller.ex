defmodule AfterGlow.WidgetItemController do
  use AfterGlow.Web, :controller

  alias AfterGlow.WidgetItems
  alias AfterGlow.Widgets.WidgetItem
  alias AfterGlow.WidgetItemView

  alias JaSerializer.Params

  alias AfterGlow.Plugs.Authorization
  plug(Authorization)

  action_fallback(AfterGlow.Web.FallbackController)

  def index(conn, _params) do
    widget_items = WidgetItems.list_widget_items()
    render(conn, "index.json", widget_item_items: widget_items)
  end

  def create(conn, %{"data" => data = %{"type" => "widget-items", "attributes" => _params}}) do
    prms = Params.to_attributes(data)

    with {:ok, %WidgetItem{} = widget_item} <- WidgetItems.create_widget_item(prms) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", widget_item_path(conn, :show, widget_item))
      |> render("show.json", widget_item: widget_item)
    end
  end

  def show(conn, %{"id" => id}) do
    widget_item = WidgetItems.get_widget_item!(id)

    json(
      conn,
      WidgetItemView
      |> JaSerializer.format(widget_item, conn, type: 'widget_item')
    )
  end

  def update(conn, %{
        "id" => id,
        "data" => data = %{"type" => "widget-items", "attributes" => _params}
      }) do
    widget_item = WidgetItems.get_widget_item!(id)
    prms = Params.to_attributes(data)

    with {:ok, %WidgetItem{} = widget_item} <- WidgetItems.update_widget_item(widget_item, prms) do
      render(conn, "show.json", widget_item: widget_item)
    end
  end

  def delete(conn, %{"id" => id}) do
    widget_item = WidgetItems.get_widget_item!(id)

    with {:ok, %WidgetItem{}} <- WidgetItems.delete_widget_item(widget_item) do
      send_resp(conn, :no_content, "")
    end
  end
end
