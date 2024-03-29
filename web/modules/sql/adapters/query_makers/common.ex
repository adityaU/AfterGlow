defmodule AfterGlow.Sql.Adapters.QueryMakers.Common do
  defmacro __using__(_) do
    quote location: :keep do
      import SqlDust.Query

      @with_query_regex ~r/((WITH|with)(.|\n)*\)( |\n)*)select/
      @query_end_of_line ~r/\r\n/

      @time_fn_based_on_duration %{
        "seconds" => "now()",
        "minutes" => "now()",
        "hours" => "now()",
        "days" => "current_date",
        "weeks" => "current_date",
        "months" => "current_date",
        "years" => "current_date",
        "quarters" => "current_date"
      }

      def limit_rows_in_query(query, rows_number) do
        limit_offset_regex = ~r/(limit|LIMIT) +(\d+) +(offset|OFFSET) +(\d+)$/
        limit_regex = ~r/(limit|LIMIT) +(\d+)$/

        {limit_add_needed, {limit_added, query}} =
          query
          |> String.trim()
          |> String.trim(";")
          |> set_limit(limit_regex, rows_number)
          |> set_limit(limit_offset_regex, rows_number)

        if limit_add_needed,
          do: {limit_added, query},
          else: {false, query}
      end

      defp set_limit({bool, query}, regex, rows_number) do
        if bool, do: {bool, query}, else: set_limit(query, regex, rows_number)
      end

      defp set_limit(query, regex, "false") do
        {false, {false, query}}
      end

      defp set_limit(query, regex, false) do
        {false, {false, query}}
      end

      defp set_limit(query, regex, rows_number) do
        case Regex.run(regex, query) do
          [_, _limit_text, limit] ->
            {true,
             replace_limit(
               regex,
               limit |> String.to_integer(),
               query,
               "LIMIT #{rows_number}",
               rows_number
             )}

          [_, _limit_text, limit, _offset_text, offset] ->
            {true,
             replace_limit(
               regex,
               limit |> String.to_integer(),
               query,
               "LIMIT #{rows_number} OFFSET #{offset}",
               rows_number
             )}

          _ ->
            {false, {false, query}}
        end
      end

      defp replace_limit(regex, limit, query, text, rows_number) do
        if limit <= rows_number do
          {false, query}
        else
          {true, Regex.replace(regex, query, text)}
        end
      end

      defp adjust_with(query) do
        query = Regex.replace(@query_end_of_line, query, "\n")

        with_part_match = Regex.scan(@with_query_regex, query)

        if with_part_match && with_part_match |> length != 0 do
          with_part = with_part_match |> Enum.at(0) |> Enum.at(1)
          with_part <> String.replace(query, with_part, "")
        else
          query
        end
      end

      def sql(query_record, adapter) do
        options = options(query_record, adapter)

        query =
          SqlDust.from(query_record[:table]["name"], options, query_record[:schema]) |> elem(0)

        query =
          if query_record[:limit] && query_record[:limit] != "" do
            query <> " " <> "LIMIT #{query_record[:limit]}"
          else
            query
          end

        query =
          if query_record[:offset] && query_record[:offset] != "" do
            query <> " " <> "OFFSET #{query_record[:offset]}"
          else
            query
          end

        query = adjust_with(query)

        query
      end

      def options(query_record, adapter) do
        group_bys = group_bys_maker(query_record[:group_bys])
        order_by_columns = order_by_columns(query_record[:order_bys])
        order_bys = order_bys_maker(query_record[:order_bys])
        order_bys_with_group_bys = sanitize_order_by(group_bys, order_bys)

        columns_required = %{
          select:
            select_maker(
              query_record[:selects],
              find_columns_required_for_select(group_bys, order_by_columns)
            )
            |> Enum.map(fn x -> x |> String.split("sep|rator") |> Enum.join(" ") end),
          group_by: sanitize_group_by(group_bys, order_by_columns),
          where: where_maker(query_record[:filters]) || [],
          order_by: order_bys_with_group_bys,
          adapter: adapter,
          limit: nil
        }
      end

      def sanitize_order_by(group_bys, order_bys) do
        (order_bys ||
           [] ++
             ((group_bys || [])
              |> Enum.map(fn x -> (x |> String.split("sep|rator") |> Enum.at(0)) <> " ASC" end)))
        |> Enum.uniq()
        |> cleanup_list
      end

      def sanitize_group_by(group_bys, order_by_columns) do
        (find_columns_required_for_group_by(group_bys, order_by_columns) || [])
        |> Enum.map(fn x -> x |> String.split("sep|rator") |> Enum.at(0) end)
        |> cleanup_list
      end

      def cleanup_list([]), do: nil
      def cleanup_list(el), do: el
      def find_columns_required_for_group_by(nil, _order_by), do: nil
      def find_columns_required_for_group_by([], _order_by), do: []

      def find_columns_required_for_group_by(group_by, order_by) do
        find_columns_required_for_select(group_by, order_by)
      end

      def find_columns_required_for_select(nil, _order_by), do: []
      def find_columns_required_for_select([], _order_by), do: []

      def find_columns_required_for_select(group_by, order_by) do
        (group_by ++ order_by) |> Enum.uniq()
      end

      def order_by_columns(options) when is_nil(options), do: []

      def order_by_columns(options) do
        options
        |> cleanup
        |> parse_order_by_and_find_columns
        |> cleanup
      end

      def parse_order_by_and_find_columns([]), do: []

      def parse_order_by_and_find_columns(el) when is_list(el) do
        el
        |> Enum.map(fn x ->
          ~s/"#{x["column"]["name"]}"/
        end)
      end

      def select_maker(nil, columns_required) when length(columns_required) == 0, do: ["*"]

      def select_maker(nil, columns_required) when length(columns_required) != 0,
        do: columns_required

      def select_maker([], columns_required) when length(columns_required) != 0,
        do: columns_required

      def select_maker(nil, []), do: ["*"]
      def select_maker([], nil), do: ["*"]
      def select_maker([], []), do: ["*"]

      def select_maker(options, columns_required) do
        options
        |> cleanup
        |> parse_select(columns_required)
        |> cleanup
      end

      def group_bys_maker(options) when is_nil(options), do: nil

      def group_bys_maker(options) do
        options
        |> cleanup
        |> parse_group_bys
        |> cleanup
      end

      def order_bys_maker(options) when is_nil(options), do: nil

      def order_bys_maker(options) do
        options
        |> cleanup
        |> parse_order_bys
      end

      def where_bys_maker(options) when is_nil(options), do: nil

      def where_maker(options) do
        options
        |> cleanup
        |> parse_filters
        |> cleanup
      end

      def cleanup(nil), do: nil

      def cleanup(el) do
        el
        |> Enum.reject(fn x -> is_nil(x) or x == "" or x == %{} or x == [] or x == ~s/""/ end)
      end

      def parse_group_bys([]), do: nil

      def parse_group_bys(el) when is_list(el) do
        el
        |> Enum.map(fn x ->
          cast_group_by((x |> Enum.at(0))["name"] || (x |> Enum.at(0))["value"], x |> Enum.at(1))
        end)
      end

      def parse_order_bys([]), do: nil

      def parse_order_bys(el) when is_list(el) do
        el
        |> Enum.map(fn x ->
          if get_in(x, ["selected", "raw"]) do
            get_in(x, ["selected", "value"])
          else
            ~s/"#{x["column"]["name"]}"/ <>
              " " <> (x["order"]["value"] |> parse_order_type || "ASC")
          end
        end)
      end

      def parse_order_type(""), do: nil
      def parse_order_type(nil), do: "ASC"
      def parse_order_type("ASC"), do: "ASC"
      def parse_order_type("DESC"), do: "DESC"
      def parse_order_type(el), do: "ASC"

      def parse_filters(nil), do: nil
      def parse_filters([]), do: nil

      def parse_filters(el) when is_list(el) do
        el
        |> Enum.map(fn x ->
          x
          parse_filter(x)
        end)
      end

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
        ~s/"#{col["name"]}"/ <> " " <> "is NULL"
      end

      def parse_filter(%{
            "column" => col,
            "operator" => %{"value" => "is not NULL", "name" => _name},
            "value" => _val,
            "valueDateObj" => _valdate
          }) do
        ~s/"#{col["name"]}"/ <> " " <> "is not NULL"
      end

      def parse_filter(%{
            "column" => col,
            "operator" => %{"value" => "matches", "name" => _name},
            "value" => val,
            "valueDateObj" => valdate
          }) do
        "lower(" <>
          ~s/"#{col["name"]}"/ <>
          ") like" <> " '%" <> (val |> String.downcase()) <> "%'"
      end

      def parse_filter(%{
            "column" => col,
            "operator" => %{"value" => "ends with", "name" => _name},
            "value" => val,
            "valueDateObj" => valdate
          }) do
        "lower(" <>
          ~s/"#{col["name"]}"/ <>
          ") like" <> " '%" <> (val |> String.downcase()) <> "'"
      end

      def parse_filter(%{
            "column" => col,
            "operator" => %{"value" => "starts with", "name" => _name},
            "value" => val,
            "valueDateObj" => valdate
          }) do
        "lower(" <>
          ~s/"#{col["name"]}"/ <>
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

        ~s/"#{col["name"]}"/ <> " " <> op_value <> " " <> (val |> parse_filter_value(valdate))
      end

      def parse_filter_value(v, %{"date" => false}), do: "'#{v}'"

      def parse_filter_value(v, %{
            "date" => false,
            "value" => _val,
            "dtt" => _dtt,
            "duration" => _dur
          }),
          do: "'#{v}'"

      def parse_filter_value(_v, %{
            "date" => true,
            "value" => val,
            "dtt" => dtt,
            "duration" => dur
          }) do
        parse_filter_date_obj_value(val, dtt, dur)
      end

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

        "(#{@time_fn_based_on_duration[duration]} #{op} INTERVAL '#{val} #{duration}')"
      end

      def parse_select([], columns_required) when length(columns_required) == 0, do: "*"

      def parse_select([], columns_required) when length(columns_required) != 0,
        do:
          columns_required
          |> Enum.map(fn x ->
            if !Regex.match?(~r/".+"/, x), do: ~s/"#{x}"/, else: x
          end)

      def parse_select(el, columns_required) when is_list(el) do
        ((el
          |> Enum.map(fn x ->
            stringify_select(x, columns_required)
          end)) ++ columns_required)
        |> Enum.uniq()
        |> List.flatten()
        |> Enum.map(fn x ->
          if !Regex.match?(~r/".+"/, x) && x != "*", do: ~s/"#{x}"/, else: x
        end)
      end

      def cast_group_by(el, nil), do: ~s/"#{el}"/
      def cast_group_by(el, "day"), do: ~s/CAST("#{el}" AS date)  sep|rator as "#{el} by Day"/

      def cast_group_by(el, "minutes"),
        do: ~s/date_trunc('minute', "#{el}") sep|rator as "#{el} by Minute"/

      def cast_group_by(el, "seconds"),
        do: ~s/date_trunc('second', "#{el}") sep|rator as "#{el} by Second"/

      def cast_group_by(el, "hour"),
        do: ~s/date_trunc('hour', "#{el}") sep|rator as "#{el}  by Hour"/

      def cast_group_by(el, "week"),
        do:
          ~s/(date_trunc('week', ("#{el}" + INTERVAL '1 day')) - INTERVAL '1 day') sep|rator as "#{el}  by Week"/

      def cast_group_by(el, "month"),
        do: ~s/date_trunc('month', "#{el}") sep|rator as "#{el}  by Month"/

      def cast_group_by(el, "quarter"),
        do: ~s/date_trunc('quarter', "#{el}") sep|rator as "#{el}  by  Quarter"/

      def cast_group_by(el, "year"),
        do: ~s/CAST(extract(year from "#{el}") AS integer) sep|rator as "#{el}  by Year"/

      def cast_group_by(el, "hour_day"),
        do:
          ~s/CAST(extract(hour from "#{el}") AS integer) sep|rator as "#{el}  by hour of the day"/

      def cast_group_by(el, "day_week"),
        do:
          ~s/(CAST(extract(dow from "#{el}") AS integer) + 1) sep|rator as "#{el}  by Day of the Week"/

      def cast_group_by(el, "day_month"),
        do:
          ~s/CAST(extract(day from "#{el}") AS integer) sep|rator as "#{el}  by By Day of the Month"/

      def cast_group_by(el, "week_year"),
        do:
          ~s/CAST(extract(week from ("#{el}" + INTERVAL '1 day')) as integer) sep|rator as "#{el}  by Week of the Year"/

      def cast_group_by(el, "month_year"),
        do:
          ~s/CAST(extract(month from "#{el}") AS integer) sep|rator as "#{el}  by Month of the Year"/

      def cast_group_by(el, "quarter_year"),
        do:
          ~s/CAST(extract(quarter from "#{el}") AS integer) sep|rator as "#{el}  by Quarter of the Year"/

      def stringify_select(%{"raw" => true, "value" => value}, columns_required), do: value
      def stringify_select(%{"name" => _name, "value" => "raw_data"}, []), do: "*"
      def stringify_select(%{"name" => _name, "value" => "raw_data"}, columns_required), do: "*"

      def stringify_select(%{"name" => _name, "value" => "count"}, columns_required),
        do: ~s/count(*) as "count"/

      def stringify_select(%{"agg" => "count of rows", "column" => nil}, columns_required),
        do: "count(*) sep|rator as \"count of rows\""

      def stringify_select(%{"agg" => "count of rows", "column" => column}, columns_required),
        do: ~s/count(distinct "#{column}") sep|rator as "count of #{column}"/

      def stringify_select(%{"agg" => "minimum of", "column" => column}, columns_required),
        do: ~s/min("#{column}") sep|rator as "minimum of #{column}"/

      def stringify_select(%{"agg" => "maximum of", "column" => column}, columns_required),
        do: ~s/max("#{column}") sep|rator as "max of #{column}"/

      def stringify_select(%{"agg" => "average of", "column" => column}, columns_required),
        do: ~s/avg("#{column}") sep|rator as "average of #{column}"/

      def stringify_select(%{"agg" => "sum of", "column" => column}, columns_required),
        do: ~s/sum("#{column}") sep|rator as "sum of #{column}"/

      def stringify_select(
            %{"agg" => "standard deviation", "column" => column},
            columns_required
          ),
          do: ~s/stddev("#{column}")  sep|rator as "standard deviation of #{column}"/

      def stringify_select(%{"agg" => "standard variance", "column" => column}, columns_required),
        do: ~s/variance("#{column}")  sep|rator as "variance of #{column}"/

      def stringify_select(
            %{"agg" => "percentile of", "column" => column, "value" => value},
            columns_required
          ),
          do:
            ~s/percentile_cont(#{value / 100}) within group (order by "#{column}") sep|rator as "p#{value} of #{column}"/

      defoverridable stringify_select: 2,
                     parse_filter_date_obj_value: 3,
                     cast_group_by: 2,
                     find_columns_required_for_select: 2,
                     options: 2
    end
  end
end
