defmodule AfterGlow.OpenAI.Completion do
  alias AfterGlow.Settings.ApplicableSettings
  alias AfterGlow.Repo

  @moduledoc """
  OpenAI Completion API
  """
  alias AfterGlow.Tables.QueryFunctions, as: Tables
  alias AfterGlow.Database.QueryFunctions, as: Databases
  @url "https://api.openai.com/v1/completions"
  @headers [
    {"Content-Type", "application/json"}
  ]

  def match_prompt(prompt, name) do
    prompt
    |> String.replace("\n", " ")
    |> String.split(" ")
    |> Enum.map(fn p ->
      p = p |> String.trim()
      Regex.match?(~r/"#{p}/, name)
    end)
    |> Enum.any?()
  end

  def fetch_database_tables_with_their_columns(database_id, prompt, schema) do
    Tables.find_by_database_id(database_id)
    |> Repo.preload([:columns])
    |> Enum.map(fn table ->
      if Regex.match?(~r/#{schema}/, table.name) && match_prompt(prompt, table.name) do
        "# #{table.name}(#{table.columns |> Enum.map(& &1.name) |> Enum.join(", ")})"
      else
        nil
      end
    end)
    |> Enum.filter(& &1)
    |> Enum.join("\n")
  end

  def fetch_nouns_and_verbs(prompt, current_user) do
    request = %HTTPoison.Request{
      method: :post,
      url: @url,
      body:
        Jason.encode!(%{
          model: "text-davinci-003",
          prompt:
            "list nouns and verbs from this text in json form - ```#{prompt}``` \n Convert all nouns to singular form, convert all verbs to present tense verb. In json key for all nouns must be `noun` and key for all verbs must be `verb`. data type for `noun` and `verb` must be array of strings",
          temperature: 0,
          max_tokens: 250
        }),
      headers: add_open_ai_key(@headers, current_user)
    }

    {:ok, nouns_and_verbs} = HTTPoison.request(request)

    body = Jason.decode!(nouns_and_verbs.body)

    # doc 
    json =
      if body["choices"] && body["choices"] |> length > 0 do
        str = body["choices"] |> Enum.at(0) |> Map.get("text")
        str = str |> String.replace("`", "")
        Jason.decode!(str)
      else
        %{}
      end

    ((json["noun"] || json["nouns"] || []) ++ (json["verb"] || json["verbs"] || []))
    |> Enum.join(" ")
  end

  @doc """
  Completes a given prompt and database_id
  """
  def complete(prompt, database_id, current_user) do
    # fetch database tables and columns in json form

    {:ok, database} = Databases.get(database_id)

    headers = add_open_ai_key(@headers, current_user)
    schema = Regex.run(~r/schema: *(.+) *\n/, prompt)

    prompt =
      if schema do
        prompt |> String.replace(schema |> Enum.at(0), "")
      else
        ""
      end

    schema =
      if schema do
        schema |> Enum.at(1) |> String.trim()
      else
        ""
      end

    noun_and_verbs = fetch_nouns_and_verbs(prompt, current_user)

    body = %{
      model: ApplicableSettings.openai_model(current_user) || "text-curie-001",
      prompt: ~s/\#\#\# #{database.db_type} SQL tables, with their properties:
      #
      #{fetch_database_tables_with_their_columns(database_id, noun_and_verbs, schema)}
      #
      ### A query to #{prompt}.
      # No semicolon in the end/,
      temperature: 0,
      max_tokens: 500
    }

    request = %HTTPoison.Request{
      method: :post,
      url: @url,
      body: Jason.encode!(body),
      headers: headers,
      params: []
    }

    {:ok, response} = HTTPoison.request(request)

    %{status: response.status_code, body: Jason.decode!(response.body), request_body: body}
  end

  def add_open_ai_key(headers, current_user) do
    case headers do
      [] ->
        [{"Authorization", "Bearer #{ApplicableSettings.openai_api_key(current_user)}"}]

      _ ->
        headers ++
          [{"Authorization", "Bearer #{ApplicableSettings.openai_api_key(current_user)}"}]
    end
  end
end
