require IEx
defmodule AfterGlow.TagController do
  use AfterGlow.Web, :controller

  alias AfterGlow.Tag
  alias AfterGlow.Question
  alias AfterGlow.Dashboard
  alias JaSerializer.Params
  alias AfterGlow.CacheWrapper

  import Ecto.Query

  plug :scrub_params, "data" when action in [:create, :update]

  def index(conn, _params) do
    tags = Repo.all(from t in Tag, select: [:id])
    |> Enum.map(fn x -> x.id end)
    |> CacheWrapper.get_by_ids(Tag) |> Repo.preload(:dashboards) |> Repo.preload(:questions)
    render(conn, :index, data: tags)
  end

  def create(conn, %{"data" => data = %{"type" => "tags", "attributes" => _tag_params}}) do
    prms =  Params.to_attributes(data)
    changeset = Tag.changeset(%Tag{}, prms) 
    question_ids = prms["questions_ids"] || []
    questions = if question_ids |> Enum.empty? , do: nil, else: Repo.all(from q in Question, where: q.id in ^question_ids )
    dashboard_ids = prms["dashboards_ids"] || []
    dashboards = if dashboard_ids |> Enum.empty? , do: nil, else: Repo.all(from d in Dashboard, where: d.id in ^dashboard_ids )
    case Tag.insert(changeset, questions, dashboards) do
      {:ok, tag} ->
        tag = tag |> Repo.preload(:dashboards) |> Repo.preload(:questions)
        conn
        |> put_status(:created)
        |> put_resp_header("location", tag_path(conn, :show, tag))
        |> render(:show, data: tag)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:errors, data: changeset)
    end
  end
  def show(conn, %{"id" => id}) do
    tag = Repo.get!((from t in Tag, select: [:id]), id)
    tag = CacheWrapper.get_by_id(tag.id, Tag) |> Repo.preload(:dashboards) |> Repo.preload(:questions)
    render(conn, :show, data: tag)
  end

  def update(conn, %{"id" => id, "data" => data = %{"type" => "tags", "attributes" => _tag_params}}) do
    prms =  Params.to_attributes(data)
    tag = Repo.get!(Tag, id) |> Repo.preload(:dashboards) |> Repo.preload(:questions)
    changeset = Tag.changeset(tag, Params.to_attributes(data))
    question_ids = prms["questions_ids"]
    questions = if question_ids |> Enum.empty? , do: nil, else: Repo.all(from q in Question, where: q.id in ^question_ids )
    dashboard_ids = prms["dashboard_ids"]
    dashboards = if dashboard_ids |> Enum.empty? , do: nil, else: Repo.all(from q in Dashboard, where: q.id in ^question_ids )

    case Tag.update(changeset, questions, dashboards) do
      {:ok, tag} ->
        render(conn, :show, data: tag)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:errors, data: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    tag = Repo.get!(Tag, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(tag)

    send_resp(conn, :no_content, "")
  end

end
