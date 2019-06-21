defmodule AfterGlow.ApiActions.ApiAction do
  use Ecto.Schema
  import Ecto.Changeset
  alias AfterGlow.Question
  import EctoEnum, only: [defenum: 2]

  defenum(MethodEnum, GET: 1, POST: 2, PUT: 3, DELETE: 4, PATCH: 5)

  schema "api_actions" do
    belongs_to(:question, Question)
    field(:url, :string)
    field(:headers, :map)
    field(:body, :string)
    field(:method, MethodEnum)
    field(:name, :string)
    field(:column, :string)
    field(:color, :string)
    field(:hidden, :boolean)
    field(:open_in_new_tab, :boolean)
    field(:response_settings, :map)
    timestamps()
  end

  def changeset(%__MODULE__{} = api_actions, attrs) do
    api_actions
    |> cast(attrs, [
      :url,
      :name,
      :headers,
      :body,
      :color,
      :open_in_new_tab,
      :method,
      :question_id,
      :hidden,
      :column
    ])
    |> validate_required([:url, :name, :method, :question_id])
  end

  def cache_deletable_associations do
    [:question]
  end
end
