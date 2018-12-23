defmodule AfterGlow.ApiActions.ApiActionLog do
  use Ecto.Schema
  import Ecto.Changeset
  alias AfterGlow.ApiActions.ApiAction
  alias AfterGlow.User

  schema "api_action_logs" do
    belongs_to(:api_action, ApiAction)
    field(:url, :string)
    field(:request_headers, :map)
    field(:response_headers, :map)
    field(:request_body, :string)
    field(:response_body, :string)
    field(:status_code, :integer)
    field(:request_method, ApiAction.MethodEnum)
    field(:variables, {:array, :string})
    belongs_to(:user, User)

    timestamps()
  end

  def changeset(%__MODULE__{} = api_actions, attrs) do
    api_actions
    |> cast(attrs, [
      :url,
      :request_headers,
      :response_headers,
      :request_body,
      :response_body,
      :request_method,
      :api_action_id,
      :user_id,
      :status_code
    ])
    |> validate_required([:url, :request_headers, :response_headers, :api_action_id, :user_id])
  end
end
