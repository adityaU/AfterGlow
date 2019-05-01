defmodule AfterGlow.Utils.Controllers.Crud do
  defmacro __using__(_opts) do
    quote do
      use AfterGlow.Web, :controller

  alias JaSerializer.Params

      def index(conn, _params) do
        results = @query_functions.list()

        render(conn, "index.json", %{(@model_type |> String.to_atom()) => results})
      end

      def get(conn, %{"id" => id}) do
        result = @query_functions.get(id)

        render(conn, "show.json", %{
          (@model_type |> Inflex.singularize() |> String.to_atom()) => result
        })
      end

      def create(conn, %{"data" => data = %{"type" => @model_type, "attributes" => _teams_params}}) do
        prms = Params.to_attributes(data)

        with {:ok, %@model{} = result} <- @query_functions.create(prms) do
          conn
          |> put_status(:created)
          |> render("show.json", %{
            (@model_type |> Inflex.singularize() |> String.to_atom()) => result
          })
        end
      end

      def update(conn, %{
            "data" => data = %{"id" => id, "type" => @model_type, "attributes" => _teams_params}
          }) do
        prms = Params.to_attributes(data)

        with {:ok, %@model{} = result} <- @query_functions.update(id, prms) do
          conn
          |> render("show.json", %{
            (@model_type |> Inflex.singularize() |> String.to_atom()) => result
          })
        end
      end

      def delete(conn, %{"id" => id}) do
        @query_functions.delete(id)

        send_resp(conn, :no_content, "")
      end

      defoverridable index: 2, get: 2, create: 2, update: 2, delete: 2
    end
  end
end
