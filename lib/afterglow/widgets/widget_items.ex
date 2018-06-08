defmodule AfterGlow.WidgetItems do
  @moduledoc """
  The WidgetItems context.
  """

  import Ecto.Query, warn: false
  alias AfterGlow.CacheWrapper.Repo
  alias AfterGlow.Widgets.WidgetItem

  import Ecto.Query, only: [from: 2]

  @doc """
  Returns the list of widget_items.

  ## Examples

  iex> list_widget_items()
  [%WidgetItem{}, ...]

  """
  def list_widget_items do
    Repo.all(WidgetItem)
  end

  @doc """
  Gets a single widget_item.

  Raises `Ecto.NoResultsError` if the WidgetItem does not exist.

  ## Examples

  iex> get_widget_item!(123)
  %WidgetItem{}

  iex> get_widget_item!(456)
  ** (Ecto.NoResultsError)

  """
  def get_widget_item!(id) do
    Repo.get!(WidgetItem, id)
    |> Repo.preload(:widget)
  end

  @doc """
  Creates a widget_item.

  ## Examples

  iex> create_widget_item(%{field: value})
  {:ok, %WidgetItem{}}

  iex> create_widget_item(%{field: bad_value})
  {:error, %Ecto.Changeset{}}

  """
  def create_widget_item(attrs \\ %{}) do
    %WidgetItem{}
    |> WidgetItem.changeset(attrs)
    |> Repo.insert_with_cache()
  end

  @doc """
  Updates a widget_item.

  ## Examples

  iex> update_widget_item(widget_item, %{field: new_value})
  {:ok, %WidgetItem{}}

  iex> update_widget_item(widget_item, %{field: bad_value})
  {:error, %Ecto.Changeset{}}

  """
  def update_widget_item(%WidgetItem{} = widget_item, attrs) do
    widget_item
    |> WidgetItem.changeset(attrs)
    |> Repo.update_with_cache()
  end

  @doc """
  Deletes a WidgetItem.

  ## Examples

  iex> delete_widget_item(widget_item)
  {:ok, %WidgetItem{}}

  iex> delete_widget_item(widget_item)
  {:error, %Ecto.Changeset{}}

  """
  def delete_widget_item(%WidgetItem{} = widget_item) do
    Repo.delete(widget_item)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking widget_item changes.

  ## Examples

  iex> change_widget_item(widget_item)
  %Ecto.Changeset{source: %WidgetItem{}}

  """
  def change_widget_item(%WidgetItem{} = widget_item) do
    WidgetItem.changeset(widget_item, %{})
  end
end
