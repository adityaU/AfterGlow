defmodule AfterGlow.Dashboards.QueryFunctions do
  @model AfterGlow.Dashboard
  @default_preloads []

  use AfterGlow.Utils.Models.Crud

  @template File.read(Application.app_dir(:afterglow, "priv/html/dashboard_html.eex")) |> elem(1)

  alias AfterGlow.Parallel
  alias AfterGlow.Notes
  alias AfterGlow.Visualizations.Visualizations
  alias AfterGlow.Questions.QueryFunctions, as: Questions
  alias AfterGlow.Mailers.CsvMailer

  def html(id, current_user) do
    {:ok, dashboard} = get(id)

    settings =
      dashboard.settings["widgets"]
      |> Parallel.pmap(fn x ->
        {renderer_type, title, results, link} = fetch_results(x["type"], x["widID"], current_user)

        %{
          w: x["w"],
          h: x["h"],
          y: x["y"],
          x: x["x"],
          results: results,
          type: x["type"],
          renderer_type: renderer_type,
          title: title,
          link: link
        }
      end)
      |> Enum.sort(fn el1, el2 -> el1["y"] < el2["y"] end)

    html = EEx.eval_string(@template, settings: settings, name: dashboard.title)

    dashbaord_url = (Application.get_env(:afterglow, :app_root) || "") <> "dashbaords/#{id}"

    CsvMailer.mail_generic(
      current_user.email,
      "AfterGlow:" <> dashboard.title,
      html,
      "Your Email client doesn't support html emails. please visit " <>
        dashbaord_url <> "to view our dashbaord"
    )

    html
  end

  def fetch_results(type, widID, current_user) do
    case type do
      "note" ->
        {:ok, note} = Notes.get(widID)
        note.content

      "notes" ->
        {:ok, note} = Notes.get(widID)
        {"table", nil, note.content, nil}

      "visualization" ->
        {{:ok, results}, _, _} = Visualizations.results(widID, %{"variables" => []}, current_user)

        visualization = Visualizations.get(widID, false)
        question = Questions.get(visualization.question_id, false)
        title = "#{question.title} # #{visualization.name}"
        renderer_type = visualization.renderer_type

        link = (Application.get_env(:afterglow, :app_root) || "") <> "questions/#{question.id}"

        results =
          if !Enum.member?(["table", "transposed_table", "number"], renderer_type) do
            payload = %{
              settings: visualization.settings[renderer_type],
              results: %{
                columns: get_in(results, [:columns]) || get_in(results, ["columns"]) || [],
                rows: get_in(results, [:rows]) || get_in(results, ["rows"]) || [],
                column_details:
                  get_in(results, [:column_details]) || get_in(results, ["column_details"]) || []
              }
            }

            payload_base64 =
              Base.encode64(Jason.encode!(payload))
              |> IO.inspect(label: "base64Payloadsd")

            Base.decode64!(payload_base64) |> IO.inspect(label: "decoded_base64")

            (Application.get_env(:afterglow, :app_root) || "") <>
              "render_chart/?payload=#{payload_base64}"
          else
            %{
              columns: get_in(results, [:columns]) || get_in(results, ["columns"]) || [],
              rows:
                (get_in(results, [:rows]) || get_in(results, ["rows"]) || []) |> Enum.slice(0, 20)
            }
          end

        {renderer_type, title, results, link}

      "question" ->
        {{:ok, results}, _, _} =
          Visualizations.results(
            nil,
            %{"variables" => [], "question_id" => widID},
            current_user
          )

        results = %{
          columns: get_in(results, [:columns]) || get_in(results, ["columns"]) || [],
          rows: (get_in(results, [:rows]) || get_in(results, ["rows"]) || []) |> Enum.slice(0, 20)
        }

        question = Questions.get(widID, false)
        title = "#{question.title}"

        link = (Application.get_env(:afterglow, :app_root) || "") <> "questions/#{question.id}"

        {"table", title, results, link}
    end
  end
end
