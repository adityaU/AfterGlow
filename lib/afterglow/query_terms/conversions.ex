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

  @sortings %{
    "ascending" => "ASC",
    "descending" => "DESC"
  }

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
        viz_filters |> Enum.map(fn filter -> convert_filter(filter) end)
        |> Enum.filter(&(&1))
      end

    viz_groupings = get_in(viz_terms, ["details", "groupings", "details"])

    groupings =
      if viz_groupings && viz_groupings |> length() > 0 do
        viz_groupings |> Enum.map(fn grouping -> convert_groupings(grouping) end)
        |> Enum.filter(&(&1))
      end

    viz_sortings = get_in(viz_terms, ["details", "sortings", "details"])

    sortings =
      if viz_sortings && viz_sortings |> length() > 0 do
        viz_sortings |> Enum.map(fn sorting -> convert_sortings(sorting) end)
        |> Enum.filter(&(&1))
      end

    viz_views = get_in(viz_terms, ["details", "views", "details"])

    views =
      if viz_views && viz_views |> length() > 0 do
        viz_views |> Enum.map(fn view -> convert_views(view) end)
        |> Enum.filter(&(&1))
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

  defp convert_views(%{"isAggregation" => true, "raw" => false, "agg" => agg = "percentile of", "column" => column, "value" => value}) do
    %{"selected" => %{"raw" => false, "column" =>  column, "agg" => agg, "value" => value }}
  end
  defp convert_views(%{"isAggregation" => true, "raw" => false, "agg" => agg = "count of rows", "column" => column = "all"}) do
    %{"selected" => %{"raw" => false, "column" =>  nil, "agg" => agg}}
  end
  defp convert_views(%{"isAggregation" => true, "raw" => false, "agg" => agg = "count of rows", "column" => column}) do
    %{"selected" => %{"raw" => false, "column" =>  column, "agg" => agg}}
  end
  defp convert_views(%{"isAggregation" => true, "raw" => false, "agg" => agg, "column" => column}) do
    %{"selected" => %{"raw" => false, "column" =>  column, "agg" => agg}}
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

    %{"selected" => %{"raw" => true, "value" => columns |> Enum.join(", ")}}
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
