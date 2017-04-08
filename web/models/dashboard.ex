defmodule AfterGlow.Dashboard do
  use AfterGlow.Web, :model
  alias AfterGlow.Question
  alias AfterGlow.Tag
  alias AfterGlow.DashboardQuestion
  alias AfterGlow.Repo

  schema "dashboards" do
    field :title, :string
    field :update_interval, :integer
    field :last_updated, Ecto.DateTime
    field :description, :string
    field :shareable_link, Ecto.UUID
    field :is_shareable_link_public, :boolean
    field :settings, :map
    many_to_many :questions, Question, join_through: "dashboard_questions", on_delete: :delete_all, on_replace: :delete
    many_to_many :tags, Tag, join_through: "tag_dashboards", on_delete: :delete_all, on_replace: :delete
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

  def update(changeset, nil, nil), do: Repo.update(changeset)
  def update(changeset, questions, tags) do
    changeset = changeset
    |> add_questions(questions)
    |> add_tags(tags)
    Repo.update(changeset)
  end

  defp add_questions(changeset, nil), do: changeset
  defp add_questions(changeset, questions) do
      changeset |> Ecto.Changeset.put_assoc(:questions, questions)
  end

  defp add_tags(changeset, nil), do: changeset
  defp add_tags(changeset, tags) do
      changeset |> Ecto.Changeset.put_assoc(:tags, tags)
  end
end
