defmodule AfterGlow.Sql.Adapters.QueryMakers.Clickhouse do
  use AfterGlow.Sql.Adapters.QueryMakers.Common

  @time_intervals %{
    "seconds" => "second",
    "minutes" => "minute",
    "hours" => "hour",
    "days" => "day",
    "weeks" => "week",
    "months" => "month",
    "years" => "year",
    "quarters" => "quarter"
  }

  # def parse_filter_value(v, %{"date" => false}), do: "'#{v}'"
  # def parse_filter_value(v, %{"date" => false,  "value" =>  _val, "dtt" => _dtt, "duration" => _dur}), do: "'#{v}'"

  # def parse_filter_value(_v, %{"date" => true, "value" => val, "dtt" => dtt, "duration" => dur}) do
  #   parse_filter_date_obj_value(val, dtt, dur)
  # end
  def parse_filter_date_obj_value(val, dtt, dur) do
    {val, duration} =
      case dur["value"] do
        "quarters" ->
          {(val |> AfterGlow.Utils.Integer.parse_integer()) * 3, "months"}

        _ ->
          {val, dur["value"]}
      end

    op =
      case dtt["value"] do
        "ago" -> "-"
        _ -> "+"
      end

    "(now() #{op} INTERVAL #{val} #{@time_intervals[duration]})"
  end

  def stringify_select(%{"raw" => true, "value" => value}, columns_required), do: value
  def stringify_select(%{"name" => _name, "value" => "raw_data"}, []), do: "*"
  def stringify_select(%{"name" => _name, "value" => "raw_data"}, columns_required), do: "*"
  def stringify_select(%{"name" => _name, "value" => "count"}, columns_required), do: "count(*)"

  def stringify_select(%{"agg" => "count of rows", "column" => nil}, columns_required),
    do: "count(*) sep|rator as \"count of rows\""

  def stringify_select(%{"agg" => "count of rows", "column" => column}, columns_required),
    do: ~s/count(distinct #{column}) sep|rator as "count of #{column}"/

  def stringify_select(%{"agg" => "minimum of", "column" => column}, columns_required),
    do: ~s/min(#{column}) sep|rator as "minimum of #{column}"/

  def stringify_select(%{"agg" => "maximum of", "column" => column}, columns_required),
    do: ~s/max(#{column}) sep|rator as "max of #{column}"/

  def stringify_select(%{"agg" => "average of", "column" => column}, columns_required),
    do: ~s/avg(#{column}) sep|rator as "average of #{column}"/

  def stringify_select(%{"agg" => "sum of", "column" => column}, columns_required),
    do: ~s/sum(#{column}) sep|rator as "sum of #{column}"/

  def stringify_select(
        %{"agg" => "standard deviation", "column" => column},
        columns_required
      ),
      do: ~s/stddevSamp(#{column})  sep|rator as "standard deviation of #{column}"/

  def stringify_select(%{"agg" => "standard variance", "column" => column}, columns_required),
    do: ~s/varSamp(#{column})  sep|rator as "variance of #{column}"/

  def stringify_select(
        %{"agg" => "percentile of", "column" => column, "value" => value},
        columns_required
      ),
      do: ~s/ quantile(#{value / 100})(#{column}) AS "#{value}th Percentile of #{column}"/

  def cast_group_by(el, nil), do: ~s/#{el}/

  def cast_group_by(el, "day"),
    do: ~s/toDate(#{el})  sep|rator as "#{el} by Day"/

  def cast_group_by(el, "minutes"),
    do: ~s/toStartOfMinute(#{el})  sep|rator as "#{el} by Minutes"/

  def cast_group_by(el, "seconds"),
    do: ~s/toStartOfSecond(#{el})  sep|rator as "#{el} by Seconds"/

  def cast_group_by(el, "hour"),
    do: ~s/toStartOfHour(#{el})  sep|rator as "#{el} by Hours"/

  def cast_group_by(el, "week"),
    do:
      ~s/CONCAT('Week ', toWeek(#{el})::text , ',', toYear(#{el})::text)  sep|rator as "#{el} by Week"/

  def cast_group_by(el, "month"),
    do: ~s/toStartOfMonth(#{el})  sep|rator as "#{el} by Month"/

  def cast_group_by(el, "quarter"),
    do: ~s/toStartOfQuarter(#{el})  sep|rator as "#{el} by Quarter"/

  def cast_group_by(el, "year"), do: ~s/toYear(#{el}) sep|rator as "#{el}  by Year"/

  def cast_group_by(el, "hour_day"),
    do: ~s/toHour(#{el}) sep|rator as "#{el}  by hour of the day"/

  def cast_group_by(el, "day_week"),
    do: ~s/toDayOfWeek(#{el}) sep|rator as "#{el}  by Day of the Week"/

  def cast_group_by(el, "day_month"),
    do: ~s/toDayOfMonth(#{el}) sep|rator as "#{el}  by By Day of the Month"/

  def cast_group_by(el, "week_year"),
    do: ~s/toISOWeek(#{el}) sep|rator as "#{el}  by Week of the Year"/

  def cast_group_by(el, "month_year"),
    do: ~s/toMonth(#{el}) sep|rator as "#{el}  by Month of the Year"/

  def cast_group_by(el, "quarter_year"),
    do: ~s/toQuarter(#{el}) sep|rator as "#{el}  by Quarter of the Year"/

  def parse_filter(%{"raw" => true, "value" => value}), do: value
  def parse_filter(%{"column" => nil, "operator" => nil, "value" => nil}), do: nil

  def parse_filter(%{
        "column" => nil,
        "operator" => nil,
        "value" => nil,
        "valueDateObj" => _valdate
      }),
      do: nil

  def parse_filter(%{
        "column" => nil,
        "operator" => _op,
        "value" => _val,
        "valueDateObj" => _valdate
      }),
      do: nil

  def parse_filter(%{
        "column" => _col,
        "operator" => nil,
        "value" => _val,
        "valueDateObj" => _valdate
      }),
      do: nil

  def parse_filter(%{
        "column" => nil,
        "operator" => op,
        "value" => nil,
        "valueDateObj" => _valdate
      }),
      do: nil

  def parse_filter(%{
        "column" => col,
        "operator" => %{"value" => "is NULL", "name" => _name},
        "value" => val,
        "valueDateObj" => valdate
      }) do
    ~s/#{col["name"]}/ <> " " <> "is NULL"
  end

  def parse_filter(%{
        "column" => col,
        "operator" => %{"value" => "is not NULL", "name" => _name},
        "value" => _val,
        "valueDateObj" => _valdate
      }) do
    ~s/#{col["name"]}/ <> " " <> "is not NULL"
  end

  def parse_filter(%{
        "column" => col,
        "operator" => %{"value" => "matches", "name" => _name},
        "value" => val,
        "valueDateObj" => valdate
      }) do
    "lower(" <>
      ~s/#{col["name"]}/ <>
      ") like" <> " '%" <> (val |> String.downcase()) <> "%'"
  end

  def parse_filter(%{
        "column" => col,
        "operator" => %{"value" => "ends with", "name" => _name},
        "value" => val,
        "valueDateObj" => valdate
      }) do
    "lower(" <>
      ~s/#{col["name"]}/ <>
      ") like" <> " '%" <> (val |> String.downcase()) <> "'"
  end

  def parse_filter(%{
        "column" => col,
        "operator" => %{"value" => "starts with", "name" => _name},
        "value" => val,
        "valueDateObj" => valdate
      }) do
    "lower(" <>
      ~s/#{col["name"]}/ <>
      ") like" <> " '" <> (val |> String.downcase()) <> "%'"
  end

  def parse_filter(%{
        "column" => col,
        "operator" => %{"value" => op_value, "name" => _name},
        "value" => val,
        "valueDateObj" => valdate
      }) do
    valdate = %{
      "date" => valdate["date"],
      "value" => valdate["value"] || "30",
      "dtt" => valdate["dtt"] || %{"value" => "ago", "name" => "Ago"},
      "duration" => valdate["duration"] || %{"value" => "days", "name" => "Days"}
    }

    ~s/#{col["name"]}/ <> " " <> op_value <> " " <> (val |> parse_filter_value(valdate))
  end

  def parse_select([], columns_required) when length(columns_required) == 0, do: "*"

  def parse_select([], columns_required) when length(columns_required) != 0,
    do: columns_required

  def parse_select(el, columns_required) when is_list(el) do
    ((el
      |> Enum.map(fn x ->
        stringify_select(x, columns_required)
      end)) ++ columns_required)
    |> Enum.uniq()
    |> List.flatten()
  end

  def parse_order_bys([]), do: nil

  def parse_order_bys(el) when is_list(el) do
    el
    |> Enum.map(fn x ->
      if get_in(x, ["selected", "raw"]) do
        get_in(x, ["selected", "value"])
      else
        ~s/#{x["column"]["name"]}/ <>
          " " <> (x["order"]["value"] |> parse_order_type || "ASC")
      end
    end)
  end
end
