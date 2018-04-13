defmodule AfterGlow.CacheWrapper do
  import Ecto.Query
  alias AfterGlow.Repo

  def get_by_ids(ids, type) when is_list(ids), do: get_by_ids(type, ids)

  def get_by_ids(type, ids) do
    from_cache =
      ids
      |> Enum.map(fn id ->
        {id, Cachex.get!(:cache, key(type, id))}
      end)

    not_found_in_cache =
      from_cache
      |> Enum.filter(fn x ->
        x |> elem(1) == nil
      end)
      |> Enum.map(fn y ->
        y |> elem(0)
      end)

    from_cache =
      from_cache
      |> Enum.filter(fn x ->
        x |> elem(1) != nil
      end)
      |> Enum.map(fn x ->
        x |> elem(1)
        |> Repo.preload(type.default_preloads || [])
      end)

    if not_found_in_cache |> length > 0 do
      from_database =
        from(t in type, where: t.id in ^not_found_in_cache)
        |> Repo.all()
        |> Repo.preload(type.default_preloads || [])

      save_in_cache(type, from_database)
    end

    from_cache ++ (from_database || [])
  end

  def put_struct(struct) do
    Cachex.put!(:cache, key(struct.__struct__, struct.id), struct)
    delete_associations(struct)
  end

  def get_by_id(id, type) when is_integer(id), do: get_by_id(type, id)

  def get_by_id(type, id) do
    get_by_ids(type, [id]) |> Enum.at(0)
  end

  def put(key, value, time) do
    Cachex.put!(:cache, key |> wrap_key, value, ttl: time)
  end

  def get(key) do
    Cachex.get!(:cache, key |> wrap_key)
  end

  defp delete_associations(struct) do
    assoc = []

    if struct.__struct__ |> has_function(:cache_deletable_associations) do
      assoc = struct.__struct__.cache_deletable_associations
      struct = struct |> Repo.preload(assoc)
    end

    assoc
    |> Enum.each(fn x ->
      delete_cache_struct(Map.get(struct, x))
    end)
  end

  def delete_cache_struct(structs) when is_list(structs) do
    structs

    |> Enum.each(fn x ->
      delete_cache_struct(x)
    end)
  end

  def delete_cache_struct(struct) do
    type = if struct, do: struct.__struct__, else: nil

    if type do
      id = struct.id
      Cachex.del(:cache, key(type , id) )
    end
  end

  def has_function(module, func), do: Keyword.has_key?(module.__info__(:functions), func)

  defp wrap_key(key) do
    "AfterGlow.CacheWrapper::" <> key
  end

  defp key(type, id) do
    ("Identity::" <> (type |> to_string) <> "::" <> (id |> to_string))
    |> wrap_key
  end

  defp save_in_cache(type, structs) do
    structs
    |> Enum.each(fn x ->
      Cachex.put!(:cache, key(type, x.id), x)
    end)
  end
end
