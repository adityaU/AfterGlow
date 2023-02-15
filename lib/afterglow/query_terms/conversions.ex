defmodule AfterGlow.QueryTerms.Conversions do
  @datetime_groupings %{
    "As It is" => nil,
    "by Seconds" => "seconds",
    "by Minute" => "minutes",
    "by Day" => "day",
    "by Hour" => "hour",
    "by Week" => "week",
    "by Month" => "month",
    "by Quarter" => "quarter",
    "by year" => "year",
    "by Hour of the day" => "hour_day",
    "by Day of the week" => "day_week",
    "by week of year" => "week_year",
    "by month of year" => "month_year",
    "by quarter of year" => "quarter_year"
  }

  @reverse_datetime_groupings %{
    nil => "As It is",
    "seconds" => "by Seconds",
    "minutes" => "by Minute",
    "day" => "by Day",
    "hour" => "by Hour",
    "week" => "by Week",
    "month" => "by Month",
    "quarter" => "by Quarter",
    "year" => "by year",
    "hour_day" => "by Hour of the day",
    "day_week" => "by Day of the week",
    "week_year" => "by week of year",
    "month_year" => "by month of year",
    "quarter_year" => "by quarter of year"
  }

  @sortings %{
    "ascending" => "ASC",
    "descending" => "DESC"
  }

  @reverse_sortings %{
    "ASC" => "ascending",
    "DESC" => "descending"
  }

  def reverse_convert(old_terms) do
    qt = %{
      "filters" => %{"details" => []},
      "groupings" => %{"details" => []},
      "sortings" => %{"details" => []},
      "views" => %{"details" => []},
      "offset" => nil,
      "limit" => nil,
      "database" => old_terms["database"],
      "queryType" => old_terms["QueryType"],
      "rawQuery" => old_terms["rawQuery"]
    }


    qt = qt |> reverse_convert_table(old_terms)
    qt = qt |> reverse_convert_filters(old_terms)
    qt = qt |> reverse_convert_views(old_terms)
    qt = qt |> reverse_convert_groupings(old_terms)
    qt |> reverse_convert_sortings(old_terms)
  end

  def reverse_convert_sortings(qt, old_terms) do
    sortings = old_terms |> get_in(["orderBys"])

    if sortings do
      details =
        sortings
        |> Enum.map(fn g ->
          currentStage = if g |> get_in(["selected", "raw"]), do: 3, else: 0

          %{
            raw: g |> get_in(["selected", "raw"]),
            column: g |> get_in(["column", "name"]),
            currentStage: currentStage,
            value: g |> get_in(["selected", "value"]),
            direction:
              @reverse_sortings |> get_in([g |> get_in(["order", "value"])]) || "ascending"
          }
        end)

      qt |> Map.merge(%{"sortings" => %{"details" => details}})
    else
      qt
    end
  end

  def reverse_convert_groupings(qt, old_terms) do
    groupings = old_terms |> get_in(["groupBys"])

    if groupings do
      details =
        groupings
        |> Enum.map(fn g ->
          currentStage = if g |> get_in(["selected", "raw"]), do: 3, else: 0

          duration =
            if Regex.match?(~r/time|date/, g |> get_in(["selected", "data_type"]) || "") do
              @reverse_datetime_groupings |> get_in([g |> get_in(["castType", "value"])])
            else
              nil
            end

          %{
            raw: g |> get_in(["selected", "raw"]),
            column: g |> get_in(["selected", "name"]),
            currentStage: currentStage,
            value: g |> get_in(["selected", "value"]),
            duration: duration
          }
        end)

      qt |> Map.merge(%{"groupings" => %{"details" => details}})
    else
      qt
    end
  end

  def reverse_convert_views(qt, old_terms) do
    views = old_terms |> get_in(["views"])

    if views do
      details =
        views
        |> Enum.map(fn v ->
          isAggregation = v |> get_in(["selected", "value"]) == "count"

          columns =
            if v |> get_in(["selected", "value"]) == "raw_data", do: ["All Columns"], else: []

          agg = if isAggregation, do: "count of rows", else: nil
          column = if isAggregation, do: "all", else: nil
          currentStage = if v |> get_in(["selected", "raw"]), do: 3, else: 0

          %{
            raw: v |> get_in(["selected", "raw"]) || false,
            isAggregation: isAggregation,
            columns: columns,
            agg: agg,
            column: column,
            currentStage: currentStage,
            value: v |> get_in(["selected", "value"])
          }
        end)
        |> Enum.filter(fn v ->
          v |> get_in([:value])
        end)

      qt |> Map.merge(%{"views" => %{"details" => details}})
    else
      qt
    end
  end

  def reverse_convert_filters(qt, old_terms) do
    filters = old_terms |> get_in(["filters"])

    if filters do
      filters |> IO.inspect(label: "filters====================")

      details =
        filters
        |> Enum.map(fn f ->
          currentStage = if f |> get_in(["raw"]), do: 3, else: 0
          %{
            "column" => f |> get_in(["column", "name"]),
            "operator" => f |> get_in(["operator", "value"]),
            "value" => reverse_convert_filter_value(f),
            "raw" => f |> get_in(["raw"]),
            "currentStage" => currentStage
          }
        end)

      qt |> Map.merge(%{"filters" => %{"details" => details}})
    else
      qt
    end
  end

  def reverse_convert_filter_value(f = %{"value" => nil, "valueDateObj" => %{"date" => true}}) do
    %{
      "type" => "duration",
      "value" => %{
        "durationValue" => f |> get_in(["valueDateObj", "value"]),
        "durationType" => f |> get_in(["valueDateObj", "duration", "value"]),
        "durationTense" => f |> get_in(["valueDateObj", "dtt", "value"])
      }
    }
  end

  def reverse_convert_filter_value(f = %{"value" => value}) do
    case Timex.parse(value, "{ISO:Extended:Z}") do
      {:ok, datetime} ->
        %{
          "type" => "datepicker",
          "value" => Timex.format!(datetime, "{Mshort} {0D}, {YYYY} {h12}:{m} {_AM} {Z:}")
        }

      _ ->
        value
    end
  end

  def reverse_convert_table(qt, old_terms) do
    if old_terms |> get_in(["table"]) do
      qt
      |> Map.merge(%{
        "table" => old_terms["table"] |> Map.merge(%{name: old_terms |> get_in(["human_name"])})
      })
    else
      qt
    end
  end

  def convert(viz_terms) do
    qt = %{
      "filters" => nil,
      "groupBys" => nil,
      "orderBys" => nil,
      "views" => nil,
      "limit" => get_in(viz_terms, ["details", "limit"]),
      "offset" => get_in(viz_terms, ["details", "offset"])
    }

    viz_filters = get_in(viz_terms, ["details", "filters", "details"])

    filters =
      if viz_filters && viz_filters |> length() >= 0 do
        viz_filters
        |> Enum.map(fn filter -> convert_filter(filter) end)
        |> Enum.filter(& &1)
      end

    viz_groupings = get_in(viz_terms, ["details", "groupings", "details"])

    groupings =
      if viz_groupings && viz_groupings |> length() > 0 do
        viz_groupings
        |> Enum.map(fn grouping -> convert_groupings(grouping) end)
        |> Enum.filter(& &1)
      end

    viz_sortings = get_in(viz_terms, ["details", "sortings", "details"])

    sortings =
      if viz_sortings && viz_sortings |> length() > 0 do
        viz_sortings
        |> Enum.map(fn sorting -> convert_sortings(sorting) end)
        |> Enum.filter(& &1)
      end

    viz_views = get_in(viz_terms, ["details", "views", "details"])

    views =
      if viz_views && viz_views |> length() > 0 do
        viz_views
        |> Enum.map(fn view -> convert_views(view) end)
        |> Enum.filter(& &1)
      end

    qt
    |> Map.merge(%{
      "filters" => filters,
      "groupBys" => groupings,
      "orderBys" => sortings,
      "views" => views
    })
  end

  defp convert_filter(
         filter = %{
           "raw" => false,
           "value" => %{"type" => "duration", "value" => value},
           "operator" => op,
           "column" => column
         }
       ) do
    %{
      "column" => %{"name" => column},
      "operator" => %{"value" => op, "name" => nil},
      "value" => value,
      "valueDateObj" => %{
        "date" => true,
        "value" => value["durationValue"],
        "dtt" => %{"value" => value["durationTense"], "name" => "dummy"},
        "duration" => %{"value" => value["durationType"], "name" => "dummy"}
      }
    }
  end

  defp convert_filter(
         filter = %{
           "raw" => false,
           "value" => %{"type" => "datepicker", "value" => value},
           "operator" => op,
           "column" => column
         }
       ) do
    date =
      case Timex.parse(value, "{Mshort} {0D}, {YYYY} {h12}:{m} {_AM} {Z:}") do
        {:ok, datetime} -> datetime |> Timex.to_datetime() |> DateTime.to_string()
        _ -> nil
      end

    %{
      "column" => %{"name" => column},
      "operator" => %{"value" => op, "name" => nil},
      "value" => date,
      "valueDateObj" => %{"date" => false}
    }
  end

  defp convert_filter(
         filter = %{"raw" => false, "value" => val, "operator" => op, "column" => column}
       ) do
    %{
      "column" => %{"name" => column},
      "operator" => %{"value" => op, "name" => nil},
      "value" => val,
      "valueDateObj" => %{"date" => false}
    }
  end

  defp convert_filter(filter = %{"raw" => true, "value" => val}) do
    filter
  end

  defp convert_filter(filter) do
    nil
  end

  defp convert_groupings(grouping = %{"raw" => false, "column" => col, "duration" => dur}) do
    %{
      "selected" => %{"name" => col},
      "castType" => %{"value" => get_in(@datetime_groupings, [dur])}
    }
  end

  defp convert_groupings(grouping = %{"raw" => true, "value" => val}) do
    %{"selected" => grouping}
  end

  defp convert_groupings(grouping) do
    nil
  end

  defp convert_sortings(%{"raw" => false, "column" => col, "direction" => direction}) do
    %{
      "column" => %{"name" => col},
      "order" => %{"value" => get_in(@sortings, [direction]) || "ASC"}
    }
  end

  defp convert_sortings(sorting = %{"raw" => true, "value" => val}) do
    %{"selected" => sorting}
  end

  defp convert_groupings(grouping) do
    nil
  end

  # defp convert_views(%{"raw" => false, "column" => col, "direction" => direction}) do
  #   %{
  #     "column" => %{"name" => col},
  #     "order" => %{"value" => get_in(@sortings, [direction]) || "ASC"}
  #   }
  # end

  defp convert_views(%{
         "isAggregation" => true,
         "raw" => false,
         "agg" => agg = "percentile of",
         "column" => column,
         "value" => value
       }) do
    %{"selected" => %{"raw" => false, "column" => column, "agg" => agg, "value" => value}}
  end

  defp convert_views(%{
         "isAggregation" => true,
         "raw" => false,
         "agg" => agg = "count of rows",
         "column" => column = "all"
       }) do
    %{"selected" => %{"raw" => false, "column" => nil, "agg" => agg}}
  end

  defp convert_views(%{
         "isAggregation" => true,
         "raw" => false,
         "agg" => agg = "count of rows",
         "column" => column
       }) do
    %{"selected" => %{"raw" => false, "column" => column, "agg" => agg}}
  end

  defp convert_views(%{"isAggregation" => true, "raw" => false, "agg" => agg, "column" => column}) do
    %{"selected" => %{"raw" => false, "column" => column, "agg" => agg}}
  end

  defp convert_views(%{"isAggregation" => false, "raw" => false, "columns" => columns}) do
    columns =
      columns
      |> Enum.map(fn col ->
        if col == "All columns" do
          "*"
        else
          col
        end
      end)

    %{"selected" => %{"raw" => true, "value" => columns}}
  end

  defp convert_views(view = %{"raw" => true, "value" => val}) do
    %{"selected" => view}
  end

  defp convert_views(view) do
    nil
  end

  # "filters" => [
  #     %{
  #       "column" => %{
  #         "data_type" => "number",
  #         "displayKey" => "question_id",
  #         "human_name" => "question_id",
  #         "name" => "question_id"
  #       },
  #       "operator" => %{"name" => "is greater than", "value" => ">"},
  #       "value" => "233",
  #       "valueDateObj" => %{"date" => false}
  #     }
  #   ],
end
