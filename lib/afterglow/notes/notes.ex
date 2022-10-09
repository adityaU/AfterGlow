defmodule AfterGlow.Notes do

  @model AfterGlow.Notes.Note
  @default_preloads []

  use AfterGlow.Utils.Models.Crud
  @moduledoc """
  The Notes context.
  """

  import Ecto.Query, warn: false
  alias AfterGlow.CacheWrapper.Repo
  alias AfterGlow.Notes.Note

  import Ecto.Query

  @doc """
  Returns the list of notes.

  ## Examples

  iex> list_notes()
  [%Note{}, ...]

  """

  def list_notes(ids) when is_list(ids) do
    if ids != [""] do
      from(w in Note, where: w.id in ^ids)
      |> Repo.all()
      |> Repo.preload(:dashboard)
    else
      nil
    end
  end

  @doc """
  Gets a single note.

  Raises `Ecto.NoResultsError` if the Note does not exist.

  ## Examples

  iex> get_note!(123)
  %Note{}

  iex> get_note!(456)
  ** (Ecto.NoResultsError)

  """
  def get_note!(id) do
    Repo.get!(Note, id)
    |> Repo.preload(:dashboard)
  end

  @doc """
  Creates a note.

  ## Examples

  iex> create_note(%{field: value})
  {:ok, %Note{}}

  iex> create_note(%{field: bad_value})
  {:error, %Ecto.Changeset{}}

  """
  def create_note(attrs \\ %{}) do
    %Note{}
    |> Note.changeset(attrs)
    |> Repo.insert_with_cache()
  end

  @doc """
  Updates a note.

  ## Examples

  iex> update_note(note, %{field: new_value})
  {:ok, %Note{}}

  iex> update_note(note, %{field: bad_value})
  {:error, %Ecto.Changeset{}}

  """
  def update_note(%Note{} = note, attrs) do
    note
    |> Note.changeset(attrs)
    |> Repo.update_with_cache()
  end

  @doc """
  Deletes a Note.

  ## Examples

  iex> delete_note(note)
  {:ok, %Note{}}

  iex> delete_note(note)
  {:error, %Ecto.Changeset{}}

  """
  def delete_note(%Note{} = note) do
    Repo.delete(note)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking note changes.

  ## Examples

  iex> change_note(note)
  %Ecto.Changeset{source: %Note{}}

  """
  def change_note(%Note{} = note) do
    Note.changeset(note, %{})
  end
end
