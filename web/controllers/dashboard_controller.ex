defmodule SimpleBase.DashboardController do
  use SimpleBase.Web, :controller

  alias SimpleBase.Dashboard
  alias JaSerializer.Params

  plug :scrub_params, "data" when action in [:create, :update]

  def index(conn, _params) do
    dashboards = Repo.all(Dashboard)
    render(conn, "index.json-api", data: dashboards)
  end

  def create(conn, %{"data" => data = %{"type" => "dashboard", "attributes" => _dashboard_params}}) do
    changeset = Dashboard.changeset(%Dashboard{}, Params.to_attributes(data))

    case Repo.insert(changeset) do
      {:ok, dashboard} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", dashboard_path(conn, :show, dashboard))
        |> render("show.json-api", data: dashboard)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:errors, data: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    dashboard = Repo.get!(Dashboard, id)
    render(conn, "show.json-api", data: dashboard)
  end

  def update(conn, %{"id" => id, "data" => data = %{"type" => "dashboard", "attributes" => _dashboard_params}}) do
    dashboard = Repo.get!(Dashboard, id)
    changeset = Dashboard.changeset(dashboard, Params.to_attributes(data))

    case Repo.update(changeset) do
      {:ok, dashboard} ->
        render(conn, "show.json-api", data: dashboard)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:errors, data: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    dashboard = Repo.get!(Dashboard, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(dashboard)

    send_resp(conn, :no_content, "")
  end

end
