require IEx
defmodule SimpleBase.Question do
  use SimpleBase.Web, :model
  import EctoEnum, only: [defenum: 2]
  alias SimpleBase.Dashboard
  defenum QueryTypeEnum, human_sql: 0, sql: 1
  
  schema "questions" do
    field :title, :string
    field :last_updated, Ecto.DateTime
    field :sql, :string
    field :human_sql, :map
    field :results_view_settings, :map
    field :query_type, QueryTypeEnum
    field :shareable_link, Ecto.UUID
    field :is_shareable_link_public, :boolean
    many_to_many :dashboards, Dashboard, join_through: "dashboard_questions",  on_delete: :delete_all

    timestamps()
  end
  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:title, :sql, :human_sql, :query_type, :last_updated, :shareable_link, :is_shareable_link_public, :results_view_settings])
    |> validate_required([:title, :sql, :human_sql, :query_type, :results_view_settings])
    |> add_shareable_link
    |> Ecto.Changeset.put_change(:last_updated, Ecto.DateTime.utc )
  end

  defp add_shareable_link(changeset) do
    case changeset.data.shareable_link do
      nil -> changeset = changeset |> Ecto.Changeset.change(shareable_link: Ecto.UUID.generate)
      _ -> 'pass'
    end
    changeset
  end
end
