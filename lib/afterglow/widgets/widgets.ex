defmodule AfterGlow.Widgets do
  @moduledoc """
  The Widgets context.
  """

  import Ecto.Query, warn: false
  alias AfterGlow.CacheWrapper.Repo
  alias AfterGlow.Widgets.Widget

  import Ecto.Query

  @doc """
  Returns the list of widgets.

  ## Examples

  iex> list_widgets()
  [%Widget{}, ...]

  """

  def list_widgets(ids) when is_list(ids) do
    if ids != [""] do
      from(w in Widget, where: w.id in ^ids)
      |> Repo.all()
      |> Repo.preload(:widget_items)
    else
      nil
    end
  end

  def list_widgets(query) do
    search_query =
      from(
        w in Widget,
        order_by: w.updated_at,
        limit: 10
      )

    search_query =
      if query && query != "" do
        search_query
        |> where([w], ilike(w.name, ^"%#{query}%"))
      else
        search_query
      end

    search_query
    |> Repo.all()
    |> Repo.preload(:widget_items)
  end

  @doc """
  Gets a single widget.

  Raises `Ecto.NoResultsError` if the Widget does not exist.

  ## Examples

  iex> get_widget!(123)
  %Widget{}

  iex> get_widget!(456)
  ** (Ecto.NoResultsError)

  """
  def get_widget!(id) do
    Repo.get!(Widget, id)
    |> Repo.preload(:widget_items)
  end

  @doc """
  Creates a widget.

  ## Examples

  iex> create_widget(%{field: value})
  {:ok, %Widget{}}

  iex> create_widget(%{field: bad_value})
  {:error, %Ecto.Changeset{}}

  """
  def create_widget(attrs \\ %{}) do
    %Widget{}
    |> Widget.changeset(attrs)
    |> Repo.insert_with_cache()
  end

  @doc """
  Updates a widget.

  ## Examples

  iex> update_widget(widget, %{field: new_value})
  {:ok, %Widget{}}

  iex> update_widget(widget, %{field: bad_value})
  {:error, %Ecto.Changeset{}}

  """
  def update_widget(%Widget{} = widget, attrs) do
    widget
    |> Widget.changeset(attrs)
    |> Repo.update_with_cache()
  end

  @doc """
  Deletes a Widget.

  ## Examples

  iex> delete_widget(widget)
  {:ok, %Widget{}}

  iex> delete_widget(widget)
  {:error, %Ecto.Changeset{}}

  """
  def delete_widget(%Widget{} = widget) do
    Repo.delete(widget)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking widget changes.

  ## Examples

  iex> change_widget(widget)
  %Ecto.Changeset{source: %Widget{}}

  """
  def change_widget(%Widget{} = widget) do
    Widget.changeset(widget, %{})
  end
end
