defmodule AfterGlow.DashboardController do
  use AfterGlow.Web, :controller

  alias AfterGlow.Dashboard
  alias AfterGlow.Question
  alias AfterGlow.Tag

  alias AfterGlow.Variable
  alias JaSerializer.Params
  alias AfterGlow.Plugs.Authorization
  plug Authorization
  plug :authorize!, Dashboard
  plug :scrub_params, "data" when action in [:create, :update]
  plug :verify_authorized

  def index(conn, _params) do
    dashboards = Repo.all(Dashboard) |> Repo.preload(:questions) |> Repo.preload(:tags)
    conn
    |> render(:index, data: dashboards)
  end

  def create(conn, %{"data" => data = %{"type" => "dashboards", "attributes" => _dashboard_params}}) do
    prms =  Params.to_attributes(data)
    changeset = Dashboard.changeset(%Dashboard{}, prms) 
    question_ids = prms["questions_ids"]
    questions = if question_ids |> Enum.empty? , do: nil, else: Repo.all(from q in Question, where: q.id in ^question_ids )
    case Dashboard.insert(changeset, questions) do
      {:ok, dashboard} ->
        dashboard = dashboard |> Repo.preload(:questions) |> Repo.preload(:tags)
        conn
        |> put_status(:created)
        |> put_resp_header("location", dashboard_path(conn, :show, dashboard))
        |> render(:show, data: dashboard)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:errors, data: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    dashboard = Repo.get!(Dashboard, id) |> Repo.preload(:questions)|> Repo.preload(:tags)
    render(conn, :show, data: dashboard)
    
  end

  def update(conn, %{"id" => id, "data" => data = %{"type" => "dashboards", "attributes" => _dashboard_params}}) do
    prms =  Params.to_attributes(data)
    dashboard = Repo.get!(Dashboard, id) |> Repo.preload(:questions)|> Repo.preload(:tags)
    changeset = Dashboard.changeset(dashboard, prms)
    question_ids = prms["questions_ids"]
    questions = if question_ids |> Enum.empty? , do: nil, else: Repo.all(from q in Question, where: q.id in ^question_ids )
    tag_ids = prms["tags_ids"]
    tags = if tag_ids |> Enum.empty? , do: nil, else: Repo.all(from t in Tag, where: t.id in ^tag_ids )
    case Dashboard.update(changeset, questions, tags) do
      {:ok, dashboard} ->
        dashboard = dashboard |> Repo.preload(:questions)|> Repo.preload(:tags)
        render(conn, :show, data: dashboard)
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
