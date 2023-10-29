defmodule AfterGlow.OpenAIController do
  alias AfterGlow.OpenAI.Completion
  use AfterGlow.Web, :controller

  alias AfterGlow.Plugs.Authorization
  plug(Authorization)

  def complete(conn, %{"database_id" => database_id, "prompt" => prompt}) do
    completion = Completion.complete(prompt, database_id, conn.assigns.current_user)

    conn
    |> json(completion)
  end
end
