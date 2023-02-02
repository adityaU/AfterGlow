defmodule AfterGlow.Utils.Models.Crud do
  defmacro __using__(_opts) do
    quote do
      alias AfterGlow.Repo
      import Ecto.Query, only: [from: 2, subquery: 1]

      def list(), do: _list()
      def list(%{"filter" => %{"id" => ids}}), do: _list(%{"filter" => %{"id" => ids}})
      def list(%{}), do: _list(%{})

      def _list() do
        from(m in @model, order_by: [asc: :id]) |> Repo.all() |> _preload(@default_preloads)
      end

      def _list(%{"filter" => %{"id" => ids}}) do
        ids = ids |> String.split(",") |> Enum.map(&(&1 |> String.to_integer()))
        from(m in @model, where: m.id in ^ids) |> Repo.all() |> _preload(@default_preloads)
      end

      def _list(%{}) do
        @model |> Repo.all() |> _preload(@default_preloads)
      end

      def get(id, preload \\ true), do: _get(id, preload)

      def _get(id, preload \\ true) do
        from(m in @model, where: m.id == ^id)
        |> Repo.one()
        |> _preload(@default_preloads, preload)
      end

      def create(params), do: _create(params)

      def _create(params) do
        @model.changeset(%@model{}, params)
        |> Repo.insert()
        |> _preload(@default_preloads)
      end

      def update(%@model{} = model, params), do: _update(%@model{} = model, params)
      def update(id, params), do: _update(id, params)

      def _update(%@model{} = model, params) do
        @model.changeset(model, params)
        |> Repo.update()
        |> _preload(@default_preloads)
      end

      def _update(id, params) do
        model = _get(id, false)
        _update(model, params)
      end

      def delete(%@model{} = model), do: _delete(%@model{} = model)
      def delete(id), do: _delete(id)

      def _delete(%@model{} = model) do
        model |> Repo.delete() |> _preload(@default_preloads)
      end

      def _delete(id) do
        get(id, false)
        |> delete
      end

      def preload_defaults("NA"), do: "NA"
      def preload_defaults(nil), do: nil

      def preload_defaults(struct) do
        struct |> _preload(@default_preloads)
      end

      def _preload(resource, _any, false), do: resource
      def _preload(nil, _preload_options, _any), do: {:ok, nil}
      def _preload(resource, preload_options, true), do: _preload(resource, preload_options)
      def _preload({:ok, resource}, []), do: {:ok, resource}

      def _preload({:ok, resource}, preload_options),
        do: {:ok, resource |> Repo.preload(preload_options)}

      def _preload(error = {:error, _error}, _preload_options), do: error
      def _preload(nil, _any), do: {:ok, nil}
      def _preload([], _any), do: {:ok, []}
      def _preload(resource, []), do: {:ok, resource}

      def _preload(resource, preload_options),
        do: {:ok, resource |> Repo.preload(preload_options)}

      defoverridable list: 0, list: 1, get: 1, create: 1, update: 2, delete: 1
    end
  end
end
