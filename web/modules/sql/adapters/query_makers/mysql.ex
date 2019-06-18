defmodule AfterGlow.Sql.Adapters.QueryMakers.Mysql do
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
          {(val |> String.to_integer()) * 3, "months"}

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

  def cast_group_by(el, nil), do: el

  def cast_group_by(el, "day"),
    do:
      "DATE(CONCAT(year(#{el}),'-', month(#{el}), '-', day(#{el}), 'T00:00:00'))  sep|rator as \"#{
        el
      } by Day\""

  def cast_group_by(el, "minutes"),
    do:
      "TIMESTAMP(CONCAT(year(#{el}),'-', month(#{el}), '-', day(#{el}), 'T', hour(#{el}),':', minute(#{
        el
      }), ':00')) sep|rator as \"#{el} by Minute\""

  def cast_group_by(el, "seconds"),
    do:
      "TIMESTAMP(CONCAT(year(#{el}),'-', month(#{el}), '-', day(#{el}), 'T', hour(#{el}),':', minute(#{
        el
      }), ':', second(#{el}))) sep|rator as \"#{el} by Second\""

  def cast_group_by(el, "hour"),
    do:
      "TIMESTAMP(CONCAT(year(#{el}),'-', month(#{el}), '-', day(#{el}), 'T', hour(#{el}),':00:00')) sep|rator as \"#{
        el
      }  by Hour\""

  def cast_group_by(el, "week"),
    do: "CONCAT(year(#{el}),', Week: ', week(#{el})) sep|rator as \"#{el}  by Week\""

  def cast_group_by(el, "month"),
    do:
      "DATE(CONCAT(year(#{el}),'-', month(#{el}), '-01T00:00:00')) sep|rator as \"#{el}  by Month\""

  def cast_group_by(el, "quarter"),
    do: "CONCAT(year(#{el}),', Quarter: ', quarter(#{el})) sep|rator as \"#{el}  by  Quarter\""

  def cast_group_by(el, "year"), do: "year(#{el}) sep|rator as \"#{el}  by Year\""
  def cast_group_by(el, "hour_day"), do: "hour(#{el}) sep|rator as \"#{el}  by hour of the day\""

  def cast_group_by(el, "day_week"),
    do: "dayofweek(#{el}) sep|rator as \"#{el}  by Day of the Week\""

  def cast_group_by(el, "day_month"),
    do: "dayofmonth(#{el}) sep|rator as \"#{el}  by By Day of the Month\""

  def cast_group_by(el, "week_year"),
    do: "weekofyear(#{el}) sep|rator as \"#{el}  by Week of the Year\""

  def cast_group_by(el, "month_year"),
    do: "month(#{el}) sep|rator as \"#{el}  by Month of the Year\""

  def cast_group_by(el, "quarter_year"),
    do: "quarter(#{el}) sep|rator as \"#{el}  by Quarter of the Year\""
end
