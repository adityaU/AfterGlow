defmodule AfterGlow.ApiActions do
  alias AfterGlow.ApiActions.ApiAction
  alias AfterGlow.ApiActions.ApiActionLogs
  alias AfterGlow.CacheWrapper.Repo
  import Ecto.Query

  def list_api_actions(ids) do
    from(
      aa in ApiAction,
      where: aa.id in ^ids
    )
    |> Repo.all()
  end

  def list_api_actions_by_question_id(question_id) do
    from(
      aa in ApiAction,
      where:
        aa.question_id == ^question_id and fragment("? is not ?", aa.hidden, true) and
          aa.action_level == 1
    )
    |> Repo.all()
  end

  def get_api_action!(id) do
    Repo.get!(ApiAction, id)
  end

  def create_api_action(attrs \\ %{}) do
    attrs =
      if attrs["top_level_question_id"] do
        attrs
        |> Map.merge(%{
          "question_id" => attrs["top_level_question_id"],
          "action_level" => "question",
          "name" => "top_level"
        })
      else
        attrs |> Map.merge(%{"action_level" => "question_response"})
      end

    %ApiAction{}
    |> ApiAction.changeset(attrs)
    |> Repo.insert_with_cache()
  end

  def update_api_action(%ApiAction{} = api_action, attrs) do
    api_action
    |> ApiAction.changeset(attrs)
    |> Repo.update_with_cache()
  end

  def delete_api_action!(id) do
    api_action = get_api_action!(id)
    update_api_action(%ApiAction{} = api_action, %{hidden: true})
  end

  def send_request(api_action_data, variables, user) when is_map(api_action_data) do
    api_action_data = for {key, val} <- api_action_data, into: %{}, do: {String.to_atom(key), val}

    api_action = struct(ApiAction, api_action_data)

    send_request(api_action, variables, api_action.open_in_new_tab, user)
  end

  def send_request(id, variables, user) do
    api_action = get_api_action!(id)

    open_option =
      case api_action.open_option do
        "open-new-tab" -> true
        "open-same-tab" -> {true, :same}
        "show-in-modal" -> false
        _ -> false
      end

    send_request(api_action, variables, open_option, user)
  end

  def send_request(%ApiAction{} = api_action, variables, {true, :same}, user) do
    url =
      api_action.url
      |> replace_variables(variables)

    %{status_code: 307, response_body: "redirect", response_headers: nil}
    |> log_args(url, "GET", nil, nil, user.id, variables, api_action.id)
    |> save_log

    %{redirect_url: url, status: 307}
  end

  def send_request(%ApiAction{} = api_action, variables, true, user) do
    url =
      api_action.url
      |> replace_variables(variables)

    %{status_code: 301, response_body: "redirect", response_headers: nil}
    |> log_args(url, "GET", nil, nil, user.id, variables, api_action.id)
    |> save_log

    %{redirect_url: url, status: 301}
  end

  def send_request(%ApiAction{} = api_action, variables, false, user) do
    url =
      api_action.url
      |> replace_variables(variables)

    headers =
      api_action.headers
      |> Poison.encode!()
      |> replace_variables(variables)
      |> Poison.decode!()
      |> Enum.into([])

    body =
      api_action.body
      |> replace_variables(variables)

    method = api_action.method

    make_request(url, method, body || "", headers)
    |> parse_response
    |> log_args(url, method, body, headers, user.id, variables, api_action.id)
    |> save_log
  end

  def replace_variables(nil, _variables), do: nil

  def replace_variables(string, %{}), do: string
  def replace_variables(string, nil), do: string
  def replace_variables(string, []), do: string

  def replace_variables(string, variables) do
    variables
    |> Enum.reduce(string, fn variable, string ->
      variable_name =
        variable["name"]
        |> String.trim()
        |> String.replace(
          ~r(q_),
          ""
        )

      string
      |> String.replace(
        ~r({{\W*#{variable_name}\W*?}}),
        variable["value"] |> validate() |> to_string() || ""
      )
    end)
  end

  def validate(value) when is_binary(value), do: value
  def validate(value) when is_integer(value), do: value
  def validate(value) when is_float(value), do: value

  def validate(_), do: ""

  def make_request(url, method, body, headers) do
    case method |> to_string() do
      "GET" -> HTTPoison.get(url, headers)
      "POST" -> HTTPoison.post(url, body, headers)
      "PUT" -> HTTPoison.put(url, body, headers)
      "PATCH" -> HTTPoison.patch(url, body, headers)
      "DELETE" -> HTTPoison.delete(url, headers)
    end
  end

  def log_args(response, url, method, body, headers, user_id, variables, api_action_id) do
    response
    |> Map.merge(%{
      url: url,
      method: method,
      request_body: body,
      request_headers: (headers || []) |> Enum.into(%{}),
      user_id: user_id,
      variables: variables,
      api_action_id: api_action_id
    })
  end

  def save_log(log_args) do
    ApiActionLogs.save(log_args)
    log_args
  end

  def parse_response(response) do
    case response do
      {:ok, resp} ->
        resp_body =
          case resp.body
               |> :unicode.characters_to_binary()
               |> IO.inspect(label: "api response") do
            {:error, sal, _} -> sal
            result -> result
          end

        %{
          status_code: resp.status_code,
          response_body: resp_body,
          response_headers: resp.headers |> Enum.into(%{})
        }

      {:error, resp} ->
        %{status_code: 0, response_body: resp.reason, response_headers: nil}
    end
  end
end
