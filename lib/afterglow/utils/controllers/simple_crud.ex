defmodule AfterGlow.Utils.Controllers.SimpleCrud do
  defmacro __using__(_opts) do
    quote do
      use AfterGlow.Web, :controller

      action_fallback(AfterGlow.Web.SimpleFallbackController)

      def index(conn, params) do
        {:ok, results} = @query_functions.list(params)

        json(conn, %{data: results})
      end

      # def index(conn, _params) do
      #   results = @query_functions.list()

      #   render(conn, "index.json", %{(@model_type |> String.to_atom()) => results})
      # end

      def show(conn, %{"id" => id}) do
        {:ok, result} = @query_functions.get(id)

        json(conn, %{
          data: result
        })
      end

      def create(conn, params) do
        with {:ok, %@model{} = result} <-
               @query_functions.create(params) do
          conn
          |> put_status(:created)
          |> json(%{
            data: result
          })
        end
      end

      def update(conn, params) do
        with {:ok, %@model{} = result} <- @query_functions.update(params["id"], params) do
          conn
          |> json(%{
            data: result
          })
        end
      end

      def delete(conn, %{"id" => id}) do
        @query_functions.delete(id)

        send_resp(conn, :no_content, "")
      end

      defoverridable index: 2, show: 2, create: 2, update: 2, delete: 2
    end
  end
end
