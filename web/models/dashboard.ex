defmodule SimpleBase.Dashboard do
  use SimpleBase.Web, :model
  alias SimpleBase.Question
  alias SimpleBase.DashboardQuestion
  alias SimpleBase.Repo

  schema "dashboards" do
    field :title, :string
    field :update_interval, :integer
    field :last_updated, Ecto.DateTime
    field :description, :string
    field :shareable_link, Ecto.UUID
    field :is_shareable_link_public, :boolean
    field :settings, :map
    many_to_many :questions, Question, join_through: "dashboard_questions", on_delete: :delete_all
    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:id, :title, :last_updated, :description, :is_shareable_link_public, :settings])
    |> validate_required([:title])
  end

  def insert(changeset, nil), do: Repo.insert(changeset)
  def insert(changeset, questions) do
    changeset = changeset |> add_questions(questions)
    Repo.insert(changeset)
  end

  def update(changeset, nil), do: Repo.update(changeset)
  def update(changeset, questions) do
    changeset = changeset |> add_questions(questions)
    Repo.update(changeset)
  end

  defp add_questions(changeset, questions) do
    case questions |> Enum.empty? do
      true-> changeset
      false -> changeset |> Ecto.Changeset.put_assoc(:questions, questions)
    end
  end
end
