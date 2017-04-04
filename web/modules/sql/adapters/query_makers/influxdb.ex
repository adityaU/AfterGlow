require IEx
defmodule AfterGlow.Sql.Adapters.QueryMakers.InfluxDb do
  use AfterGlow.Sql.Adapters.QueryMakers.Common

  @time_intervals %{
    "seconds" => "s",
    "minutes" => "m",
    "hours"  => "h",
    "days"  => "d",
    "weeks"  => "w",
  }

  def sql(query_record) do
    options = options(query_record, :influxdb) |> IO.inspect
    query = "select #{options[:select] |> Enum.join(", ")} from #{query_record[:table]["readable_table_name"]}"
    if options[:where] |> length > 0 do
      query = "#{query} WHERE #{options[:where] |> Enum.join(" and ")}"
    end

    if  options[:group_by] && (options[:group_by] |> length > 0) do
      query = "#{query} GROUP BY #{options[:group_by] |> Enum.join(" , ")}"
    end
    
    if  options[:order_by] && (options[:order_by] |> length > 0) do
      query = "#{query} ORDER BY #{options[:order_by] |> Enum.join(" , ")}"
    end
    if query_record[:limit] do
      query = query <> " " <> "LIMIT #{query_record[:limit]}" 
    end
    if query_record[:offset] do
      query = query <> " " <> "OFFSET #{query_record[:offset]}"
    end
    query |> IO.inspect
  end

  def options query_record, adapter do
      %{
        select: select_maker(query_record[:selects], []),
        group_by: group_bys_maker(query_record[:group_bys]),
        where:  where_maker(query_record[:filters]) || [],
        order_by:  order_bys_maker(query_record[:order_bys]),
        adapter: adapter,
        limit: nil
      } |> IO.inspect
  end
  
  def find_columns_required_for_select(group_by, order_by), do: []
  def parse_filter_date_obj_value(val, dtt, dur) do
    {val, duration} = case dur["value"] do
                        "months" ->
                          { (val |> String.to_integer)*30, "d"}
                        "quarters" ->
                          { (val |> String.to_integer)*90, "d"}
                        "years" ->
                          { (val |> String.to_integer)*365, "d"}
                        _ ->
                          {val , @time_intervals[dur["value"]]} 
                      end
    op = case dtt["value"] do
           "ago" -> "-"
           _ -> "+"
         end
    "now() #{op} #{val}#{duration}"
  end

  def cast_group_by(el, nil),  do: el
  def cast_group_by(el, "day"),  do: "time(1d)"
  def cast_group_by(el, "minutes"),  do: "time(1m) "
  def cast_group_by(el, "seconds"),  do: "time(1s) "
  def cast_group_by(el, "hour"),  do: "time(1h) "
  def cast_group_by(el, "week"),  do: "time(1w) "
  def cast_group_by(el, "month"),  do: "time(30d) "
  def cast_group_by(el, "quarter"),  do: "time(90d) "
  def cast_group_by(el, "year"),  do: "time(365d) "
      
  def stringify_select(%{"raw" => true, "value" => value}, columns_required), do: value
  def stringify_select(%{"name" => _name, "value" => "raw_data"}, []), do: "*"
  def stringify_select(%{"name" => _name, "value" => "raw_data"}, columns_required), do: "*"
  def stringify_select(%{"name" => _name, "value" => "count"}, columns_required), do: "count(*)"
end
