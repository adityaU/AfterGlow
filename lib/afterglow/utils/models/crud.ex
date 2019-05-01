defmodule AfterGlow.Utils.Models.Crud do
  defmacro __using__(_opts) do
    quote do
      import Ecto.Query, only: [from: 2, subquery: 1]
      alias AfterGlow.Repo

      def list() do
        from(m in @model, order_by: [:id, :asc]) |> Repo.all() |> preload(@default_preloads)
      end

      def list(%{}) do
        @model |> Repo.all() |> preload(@default_preloads)
      end

      def get(id, preload \\ true) do
        from(m in @model, where: m.id == ^id)
        |> Repo.one()
        |> preload(@default_preloads, preload)
      end

      def create(params) do
        @model.changeset(%@model{}, params)
        |> Repo.insert()
        |> preload(@default_preloads)
      end

      def update(%@model{} = model, params) do
        @model.changeset(model, params)
        |> Repo.update()
        |> preload(@default_preloads)
      end

      def update(id, params) do
        model = get(id)
        update(model, params)
      end

      def delete(%@model{} = model) do
        model |> Repo.delete() |> preload(@default_preloads)
      end

      def delete(id) do
        get(id) |> delete
      end

      def preload_defaults("NA"), do: "NA"
      def preload_defaults(nil), do: nil

      def preload_defaults(struct) do
        struct |> preload(@default_preloads)
      end

      def preload(resource, _any, false), do: resource
      def preload(nil, _preload_options, _any), do: nil
      def preload(resource, preload_options, true), do: preload(resource, preload_options)
      def preload({:ok, resource}, []), do: resource

      def preload({:ok, resource}, preload_options),
        do: resource |> Repo.preload(preload_options)

      def preload(error = {:error, _error}, _preload_options), do: error
      def preload(nil, _any), do: nil
      def preload([], _any), do: []
      def preload(resource, []), do: resource
      def preload(resource, preload_options), do: resource |> Repo.preload(preload_options)

      defoverridable list: 0, list: 1, get: 1, create: 1, update: 2, delete: 1
    end
  end
end
