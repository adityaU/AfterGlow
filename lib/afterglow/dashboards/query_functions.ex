defmodule AfterGlow.Dashboards.QueryFunctions do
  @model AfterGlow.Dashboard
  @default_preloads []

  use AfterGlow.Utils.Models.Crud

  @template File.read(Application.app_dir(:afterglow, "priv/html/dashboard.eex.html")) |> elem(1)

  alias AfterGlow.Variable
  alias AfterGlow.Dashboards.DashboardQuestion
  alias AfterGlow.Question

  alias AfterGlow.Parallel
  alias AfterGlow.Notes
  alias AfterGlow.Visualizations.Visualizations
  alias AfterGlow.Questions.QueryFunctions, as: Questions
  alias AfterGlow.Mailers.CsvMailer
  alias AfterGlow.CacheWrapper.Repo

  import Ecto.Query, only: [from: 2]

  def possible_variables(id) do
    from(v in Variable,
      inner_join: q in Question,
      on: q.id == v.question_id,
      inner_join: dq in DashboardQuestion,
      on: dq.question_id == q.id,
      inner_join: d in @model,
      on: d.id == dq.dashboard_id,
      where: d.id == ^id,
      select: v
    )
    |> Repo.all()
    |> Enum.uniq_by(fn v -> v.name end)
  end

  def html(id, current_user, emails \\ []) do
    {:ok, dashboard} = get(id)

    settings =
      dashboard.settings["widgets"]
      |> Parallel.pmap(fn x ->
        width = (x["w"] || 0) * 800 / 12
        height = (x["h"] || 0) * 10

        {renderer_type, title, results, link} =
          try do
            fetch_results(x["type"], x["widID"], current_user, %{width: width, height: height})
          rescue
            _ ->
              title = ~s/#{x["type"] |> String.upcase()}: #{x["widID"]}/

              {"error", title,
               "Results of #{x["type"]}: #{x["widID"]} are unavailable at the moment. Please visit dashboard for details",
               nil}
          end

        %{
          w: (x["w"] || 0) * 800 / 12,
          h: (x["h"] || 0) * 10,
          y: x["y"],
          x: x["x"],
          results: results,
          type: if(renderer_type == "error", do: "error", else: x["type"]),
          renderer_type: renderer_type,
          title: title,
          link: link
        }
      end)
      |> Enum.sort(fn el1, el2 ->
        if el1.y == el2.y do
          el1.x < el2.x
        else
          el1.y < el2.y
        end
      end)

    dashboard_url = (Application.get_env(:afterglow, :app_root) || "") <> "dashbaords/#{id}"

    html =
      EEx.eval_string(@template,
        settings: settings,
        name: dashboard.title,
        dashboard_url: dashboard_url
      )

    emails =
      if emails |> length == 0 do
        [current_user.email]
      else
        emails
      end

    CsvMailer.mail_generic(
      emails,
      "AfterGlow:" <> dashboard.title,
      html,
      "Your Email client doesn't support html emails. please visit " <>
        dashboard_url <> "to view our dashboard"
    )

    html
  end

  def fetch_results("note", widID, _current_user, _dimensions) do
    case Notes.get(widID) do
      {:ok, note} ->
        {"table", nil, note.content, nil}

      _ ->
        {"table", nil, nil, nil}
    end
  end

  def fetch_results("notes", widID, current_user, dimensions),
    do: fetch_results("note", widID, current_user, dimensions)

  def fetch_results("visualization", widID, current_user, _dimensions) do
    {{:ok, results}, _, _} = Visualizations.results(widID, %{"variables" => []}, current_user)

    visualization = Visualizations.get(widID, false)
    question = Questions.get(visualization.question_id, false)
    title = "#{question.title} # #{visualization.name}"
    renderer_type = visualization.renderer_type

    link = (Application.get_env(:afterglow, :app_root) || "") <> "questions/#{question.id}"

    results = form_results(renderer_type, visualization, results)

    {renderer_type, title, results, link}
  end

  def fetch_results("question", widID, current_user, _dimensions) do
    {{:ok, results}, _, _} =
      Visualizations.results(
        nil,
        %{"variables" => [], "question_id" => widID},
        current_user
      )

    results = %{
      columns: get_in(results, [:columns]) || get_in(results, ["columns"]) || [],
      rows: (get_in(results, [:rows]) || get_in(results, ["rows"]) || []) |> Enum.slice(0, 10)
    }

    question = Questions.get(widID, false)
    title = "#{question.title}"

    link = (Application.get_env(:afterglow, :app_root) || "") <> "questions/#{question.id}"

    {"table", title, results, link}
  end

  defp hidden_column_indices(columns, settings) do
    settings
    |> get_in(["columns"])
    |> Kernel.||([])
    |> Enum.filter(&(&1 |> get_in(["show"]) == false))
    |> Enum.map(&columns_with_index(columns)[&1 |> get_in(["name"])])
  end

  defp hide_columns(columns, settings) do
    indices = hidden_column_indices(columns, settings)

    columns
    |> Enum.with_index()
    |> Enum.filter(fn {_, i} ->
      !Enum.member?(indices, i)
    end)
    |> Enum.map(fn {x, _} -> x end)
  end

  defp columns_with_index(columns) do
    columns
    |> Enum.with_index()
    |> Map.new(fn {column, index} -> {column, index} end)
  end

  defp hide_row_cells(rows, columns, settings) do
    indices = hidden_column_indices(columns, settings)

    rows
    |> Enum.map(fn row ->
      row
      |> Enum.with_index()
      |> Enum.filter(fn {_, i} ->
        !Enum.member?(indices, i)
      end)
      |> Enum.map(fn {x, _} -> x end)
    end)
  end

  defp columns(results) do
    get_in(results, [:columns]) || get_in(results, ["columns"]) || []
  end

  defp rows(results) do
    get_in(results, [:rows]) || get_in(results, ["rows"]) || []
  end

  defp form_results("transposed_table", visualization, results) do
    settings = visualization.settings |> get_in(["transposed_table"])
    columns = hide_columns(results |> columns(), settings)

    %{
      columns: [],
      rows:
        results
        |> rows()
        |> Enum.slice(0, 10)
        |> hide_row_cells(results |> columns(), settings)
        |> List.zip()
        |> Enum.map(&Tuple.to_list/1)
        |> Enum.with_index()
        |> Enum.map(fn {row, i} ->
          [columns |> Enum.at(i) | row]
        end)
    }
  end

  defp form_results("number", visualization, results) do
    settings = visualization.settings["number"]

    columns = columns_with_index(results |> columns())

    data = %{}

    dataColumnIndex =
      get_in(columns, [settings["dataColumn"]]) ||
        -1

    data =
      if dataColumnIndex >= 0 do
        data =
          data
          |> Map.merge(%{
            dataValues:
              results
              |> rows()
              |> Enum.map(fn item ->
                item |> Enum.at(dataColumnIndex)
              end)
          })

        data =
          if settings["trendFromNextRow"] do
            data =
              data
              |> Map.merge(%{
                trendsValues:
                  results
                  |> rows
                  |> Enum.map(fn item ->
                    item |> Enum.at(dataColumnIndex)
                  end)
                  |> Enum.slice(1, data.dataValues |> length)
              })

            data =
              data
              |> Map.merge(%{
                dataValues:
                  data.dataValues |> Enum.slice(0, data.dataValues |> length |> Kernel.-(1))
              })

            if settings["directReference"] do
              data |> Map.merge(%{referenceValues: data.trendsValues})
            else
              data
              |> Map.merge(%{
                referenceValues:
                  data.dataValues
                  |> Enum.with_index()
                  |> Enum.map(fn {dv, i} ->
                    val =
                      100 *
                        (dv - (data.trendsValues |> Enum.at(i))) /
                        (data.trendsValues
                         |> Enum.at(i))

                    Float.round(val, 2)
                  end)
              })
            end
          else
            trendColumnIndex = get_in(columns, [settings.trendColumn]) || -1

            if trendColumnIndex >= 0 do
              data =
                data
                |> Map.merge(%{
                  trendsValues:
                    results
                    |> rows
                    |> Enum.map(fn item ->
                      item |> Enum.at(trendColumnIndex)
                    end)
                })

              if settings["directReference"] do
                data |> Map.merge(%{referenceValues: data.trendsValues})
              else
                data
                |> Map.merge(%{
                  referenceValues:
                    data.dataValues
                    |> Enum.with_index()
                    |> Enum.map(fn {dv, i} ->
                      val =
                        100 *
                          ((dv - (data.trendsValues |> Enum.at(i))) /
                             (data.trendsValues |> Enum.at(i)))

                      Float.round(val, 2)
                    end)
                })
              end
            end
          end

        subtitleColumnIndex = get_in(columns, [settings["subtitleColumn"]]) || -1

        if subtitleColumnIndex >= 0 do
          data
          |> Map.merge(%{
            subtitles:
              results
              |> rows()
              |> Enum.map(fn item ->
                item |> Enum.at(subtitleColumnIndex)
              end)
          })
        else
          data
        end
      end

    %{
      dataValues: (get_in(data, [:dataValues]) || []) |> Enum.slice(0, 10),
      referenceValues: (get_in(data, [:referenceValues]) || []) |> Enum.slice(0, 10),
      subtitles: (get_in(data, [:subtitles]) || []) |> Enum.slice(0, 10),
      data_column_name: settings["dataColumn"]
    }
  end

  defp form_results("table", visualization, results) do
    settings = visualization.settings |> get_in(["table"])

    %{
      columns: results |> columns() |> hide_columns(settings),
      rows:
        results
        |> rows()
        |> Enum.slice(0, 10)
        |> hide_row_cells(results |> columns(), settings)
    }
  end

  defp form_results(renderer_type, visualization, results) do
    payload = %{
      settings: visualization.settings[renderer_type],
      renderer_type: renderer_type,
      results: %{
        columns: get_in(results, [:columns]) || get_in(results, ["columns"]) || [],
        rows: get_in(results, [:rows]) || get_in(results, ["rows"]) || [],
        column_details:
          get_in(results, [:column_details]) || get_in(results, ["column_details"]) || []
      }
    }

    payload_base64 = Base.encode64(Jason.encode!(payload))

    Base.decode64!(payload_base64)

    (Application.get_env(:afterglow, :app_root) || "") <>
      "render_chart/?payload=#{payload_base64}"
  end
end
