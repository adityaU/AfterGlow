defmodule AfterGlow.Web.SimpleFallbackController do
  @moduledoc """
  Translates controller action results into valid `Plug.Conn` responses.

  See `Phoenix.Controller.action_fallback/1` for more details.
  """
  use AfterGlow.Web, :controller

  import AfterGlow.Web.ChangesetView, only: [translate_errors: 1]

  def call(conn, {:error, %Ecto.Changeset{} = changeset}) do
    conn
    |> put_status(:unprocessable_entity)
    |> json(%{errors: translate_errors(changeset)})
  end

  def call(conn, {:error, :not_found}) do
    conn
    |> put_status(:not_found)
    |> render(AfterGlow.Web.ErrorView, 404)
  end

  def call(conn, {:error, :bad_request, errorMessage}) do
    conn
    |> put_status(:bad_request)
    |> json(errorMessage)
  end
end
