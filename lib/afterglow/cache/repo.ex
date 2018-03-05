defmodule AfterGlow.CacheWrapper.Repo do
  alias AfterGlow.CacheWrapper
  import AfterGlow.Extension
  extends(AfterGlow.Repo)

  def update_with_cache(changeset) do
    case update(changeset) do
      {:ok, struct} ->
        CacheWrapper.put_struct(struct)
        {:ok, struct}

      {:error, changeset} ->
        {:error, changeset}
    end
  end

  def insert_with_cache(changeset) do
    case insert(changeset) do
      {:ok, struct} ->
        CacheWrapper.put_struct(struct)
        {:ok, struct}

      {:error, changeset} ->
        {:error, changeset}
    end
  end
end
