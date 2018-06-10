defmodule AfterGlow.Dashboard do
  use AfterGlow.Web, :model
  alias AfterGlow.Question
  alias AfterGlow.Tag
  alias AfterGlow.DashboardQuestion
  alias AfterGlow.CacheWrapper.Repo
  alias AfterGlow.Variable
  alias AfterGlow.Notes.Note
  alias AfterGlow.User

  schema "dashboards" do
    field(:title, :string)
    field(:update_interval, :integer)
    field(:last_updated, Ecto.DateTime)
    field(:description, :string)
    field(:shareable_link, Ecto.UUID)
    field(:shared_to, {:array, :string})
    field(:is_shareable_link_public, :boolean)
    field(:settings, :map)
    field(:notes_settings, :map)
    belongs_to(:owner, User, foreign_key: :owner_id)

    many_to_many(
      :questions,
      Question,
      join_through: "dashboard_questions",
      on_delete: :delete_all,
      on_replace: :delete
    )

    many_to_many(
      :tags,
      Tag,
      join_through: "tag_dashboards",
      on_delete: :delete_all,
      on_replace: :delete
    )

    has_many(:variables, Variable, on_delete: :delete_all, on_replace: :delete)
    has_many(:notes, Note, on_delete: :delete_all, on_replace: :delete)
    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [
      :id,
      :title,
      :last_updated,
      :description,
      :is_shareable_link_public,
      :settings,
      :notes_settings,
      :shared_to,
      :owner_id
    ])
    |> validate_required([:title, :owner_id])
    |> add_shareable_link
  end

  defp add_shareable_link(changeset) do
    changeset =
      case changeset.data.shareable_link do
        nil -> changeset |> Ecto.Changeset.change(shareable_link: Ecto.UUID.generate())
        _ -> changeset
      end

    changeset
  end

  def default_preloads do
    [:questions, :notes]
  end

  def cache_deletable_associations do
    default_preloads
  end

  def insert(changeset, nil), do: Repo.insert_with_cache(changeset)

  def insert(changeset, questions) do
    changeset = changeset |> add_questions(questions)
    Repo.insert_with_cache(changeset)
  end

  def update(changeset, nil, nil), do: Repo.update_with_cache(changeset)

  def update(changeset, questions, tags) do
    changeset =
      changeset
      |> add_questions(questions)
      |> add_tags(tags)
      |> share_variable_question

    Repo.update_with_cache(changeset)
  end

  defp share_variable_question(changeset) do
    if changeset.changes
       |> Map.has_key?(:shared_to) do
      changeset.changes[:variables]
      |> Kernel.||(changeset.data.variables)
      |> Kernel.||([])
      |> Repo.preload(:question_filter)
      |> Enum.filter(fn var -> var.question_filter end)
      |> Enum.map(fn var ->
        if changeset.changes
           |> Map.has_key?(:shared_to) do
          Ecto.Changeset.change(
            var.question_filter,
            shared_to:
              changeset.changes.shared_to
              |> Kernel.++(var.question_filter.shared_to)
              |> Enum.uniq()
          )
          |> Repo.update_with_cache()
        end
      end)
    end

    changeset
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
