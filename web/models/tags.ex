defmodule AfterGlow.Tag do
  use AfterGlow.Web, :model
  alias AfterGlow.Question
  alias AfterGlow.TagQuestion
  alias AfterGlow.Dashboard
  alias AfterGlow.TagDashboard
  alias AfterGlow.CacheWrapper.Repo

  schema "tags" do
    field :name, :string
    field :description, :string
    field :color, :string

    many_to_many :dashboards, Dashboard, join_through: TagDashboard , on_delete: :delete_all, on_replace: :delete
    many_to_many :questions, Question, join_through: TagQuestion, on_delete: :delete_all, on_replace: :delete

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :description, :color])
    |> validate_required([:name])
  end

  def default_preloads do
    [:questions, :dashboards]
  end

  def cache_deletable_associations do
    default_preloads
  end

  def insert(changeset, nil, nil), do: Repo.insert_with_cache(changeset)
  def insert(changeset, questions, dashboards) do
    changeset = changeset
    |> add_questions(questions)
    |> add_dashboards(dashboards)
    Repo.insert_with_cache(changeset)
  end

  def update(changeset, nil, nil), do: Repo.update_with_cache(changeset)
  def update(changeset, questions, dashboards) do
    changeset = changeset
    |> add_questions(questions)
    |> add_dashboards(dashboards)
    Repo.update_with_cache(changeset)
  end

  defp add_questions(changeset, nil), do: changeset
  defp add_questions(changeset, questions) do
    case questions |> Enum.empty? do
      true-> changeset
      false -> changeset |> Ecto.Changeset.put_assoc(:questions, questions)
    end
  end
  defp add_dashboards(changeset, nil), do: changeset
  defp add_dashboards(changeset, dashboards) do
    case dashboards |> Enum.empty? do
      true-> changeset
      false -> changeset |> Ecto.Changeset.put_assoc(:dashboards, dashboards)
    end
  end
end
