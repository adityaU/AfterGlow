defmodule AfterGlow.QuestionBankController do
  use AfterGlow.Web, :controller

  alias AfterGlow.QuestionBank
  alias JaSerializer.Params

  alias AfterGlow.Plugs.Authorization
  plug Authorization
  plug :authorize!, QuestionBank
  plug :scrub_params, "data" when action in [:create, :update]
  plug :verify_authorized

  def index(conn, _params) do
    question_banks = Repo.all(QuestionBank)
    render(conn, "index.json-api", data: question_banks)
  end

  def create(conn, %{"data" => data = %{"type" => "question_bank", "attributes" => _question_bank_params}}) do
    changeset = QuestionBank.changeset(%QuestionBank{}, Params.to_attributes(data))

    case Repo.insert(changeset) do
      {:ok, question_bank} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", question_bank_path(conn, :show, question_bank))
        |> render("show.json-api", data: question_bank)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:errors, data: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    question_bank = Repo.get!(QuestionBank, id)
    render(conn, "show.json-api", data: question_bank)
  end

  def update(conn, %{"id" => id, "data" => data = %{"type" => "question_bank", "attributes" => _question_bank_params}}) do
    question_bank = Repo.get!(QuestionBank, id)
    changeset = QuestionBank.changeset(question_bank, Params.to_attributes(data))

    case Repo.update(changeset) do
      {:ok, question_bank} ->
        render(conn, "show.json-api", data: question_bank)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:errors, data: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    question_bank = Repo.get!(QuestionBank, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(question_bank)

    send_resp(conn, :no_content, "")
  end

end
