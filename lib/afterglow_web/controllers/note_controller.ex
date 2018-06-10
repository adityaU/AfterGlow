defmodule AfterGlow.NoteController do
  use AfterGlow.Web, :controller

  alias AfterGlow.Notes
  alias AfterGlow.Notes.Note
  alias AfterGlow.NoteView

  alias JaSerializer.Params

  alias AfterGlow.Plugs.Authorization
  plug(Authorization)

  action_fallback(AfterGlow.Web.FallbackController)

  def index(conn, %{"query" => query}) do
    notes = Notes.list_notes(query)
    render(conn, "index.json", notes: notes)
  end

  def index(conn, %{"filter" => %{"id" => ids}}) do
    ids = ids |> String.split(",")
    notes = Notes.list_notes(ids)
    render(conn, "index.json", notes: notes)
  end

  def create(conn, %{"data" => data = %{"type" => "notes", "attributes" => _params}}) do
    prms = Params.to_attributes(data)

    with {:ok, %Note{} = note} <- Notes.create_note(prms) do
      note = note |> Repo.preload(:dashboard)

      conn
      |> put_status(:created)
      |> put_resp_header("location", note_path(conn, :show, note))
      |> render("show.json", note: note)
    end
  end

  def show(conn, %{"id" => id}) do
    note = Notes.get_note!(id)

    json(
      conn,
      NoteView
      |> JaSerializer.format(note, conn, type: 'note')
    )
  end

  def update(conn, %{"id" => id, "data" => data = %{"type" => "notes", "attributes" => _params}}) do
    note = Notes.get_note!(id)
    prms = Params.to_attributes(data)

    with {:ok, %Note{} = note} <- Notes.update_note(note, prms) do
      note = note |> Repo.preload(:dashboard)
      render(conn, "show.json", note: note)
    end
  end

  def delete(conn, %{"id" => id}) do
    note = Notes.get_note!(id)

    with {:ok, %Note{}} <- Notes.delete_note(note) do
      send_resp(conn, :no_content, "")
    end
  end
end
