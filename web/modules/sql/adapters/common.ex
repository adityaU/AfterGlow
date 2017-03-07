defmodule SimpleBase.Sql.Adapters.Common do
  import SqlDust.Query
  def sql query_record, adapter do
    options = options(query_record, adapter)
    query = SqlDust.from(query_record[:table]["readable_table_name"], options) |> elem(0)
    if query_record[:limit] do
      query = query <> " " <> "LIMIT #{query_record[:limit]}" |> IO.inspect
    end
    if query_record[:offset] do
      query = query <> " " <> "OFFSET #{query_record[:offset]}" |> IO.inspect
    end
    query
  end

  defp options query_record, adapter do
    group_bys = group_bys_maker(query_record[:group_bys])
    order_by_columns = order_by_columns(query_record[:order_bys])
    columns_required =
    %{
      select: select_maker(query_record[:selects],  find_columns_required_for_select(group_bys, order_by_columns)),
      group_by:  find_columns_required_for_group_by(group_bys, order_by_columns),
      where:  where_maker(query_record[:filters]),
      order_by:  order_bys_maker(query_record[:order_bys]),
      adapter: adapter,
      limit: nil
    } |> IO.inspect
  end
  
  defp find_columns_required_for_group_by(nil, _order_by), do: nil
  defp find_columns_required_for_group_by([], _order_by), do: []
  defp find_columns_required_for_group_by(group_by, order_by) do
    find_columns_required_for_select(group_by, order_by)
  end
  
  defp find_columns_required_for_select(nil, _order_by), do: []
  defp find_columns_required_for_select([], _order_by), do: []
  defp find_columns_required_for_select(group_by, order_by) do
    (group_by ++ order_by) |> Enum.uniq
  end
  
  defp order_by_columns(options) when is_nil(options), do: []
  defp order_by_columns(options) do
    options
    |> cleanup
    |> parse_order_by_and_find_columns
    |> cleanup
  end

  defp parse_order_by_and_find_columns([]), do: []
  defp parse_order_by_and_find_columns(el) when is_list(el) do
    el
    |> Enum.map(fn x->
      x["column"]["name"]
    end)
  end
  
  defp select_maker(nil, columns_required) when length(columns_required) == 0, do: ["*"]
  defp select_maker(nil, columns_required) when length(columns_required) != 0, do: columns_required
  defp select_maker([], columns_required) when length(columns_required) != 0, do: columns_required
  defp select_maker([], nil), do: ["*"]
  defp select_maker options, columns_required do
    options
    |> cleanup
    |> parse_select(columns_required)

  end
  defp group_bys_maker(options) when is_nil(options), do: nil
  defp group_bys_maker options do
    options
    |> cleanup
    |> parse_group_bys
    |> cleanup
  end
  defp order_bys_maker(options) when is_nil(options), do: nil
  defp order_bys_maker options do
    options
    |> cleanup
    |> parse_order_bys
  end

  defp where_bys_maker(options) when is_nil(options), do: nil
  defp where_maker options do
    options
    |> cleanup
    |> parse_filters
    |> cleanup
  end

  defp cleanup(nil), do: nil
  defp cleanup el do
    el
    |> Enum.reject(fn x -> is_nil(x) or x == "" or x == %{} or x == [] end) 
  end

  defp parse_group_bys([]), do: nil
  defp parse_group_bys(el) when is_list(el) do
    el
    |> Enum.map(fn x->
      x["name"] || x["value"]
    end)
    
  end

  defp parse_order_bys([]), do: nil
  defp parse_order_bys(el) when is_list(el) do
    IO.inspect "==============================="
    el
    |> IO.inspect
    |> Enum.map(fn x->
      x["column"]["name"] <> " " <> ((x["order"]["value"] |> IO.inspect |> parse_order_type) || "ASC")
    end)
    |> Enum.join(" , ") |> IO.inspect
    
  end
  defp parse_order_type(""), do: nil
  defp parse_order_type(nil), do: "ASC"
  defp parse_order_type("ASC"), do: "ASC"
  defp parse_order_type("DESC"), do: "DESC"
  defp parse_order_type(el), do: "ASC"
  
  defp parse_filters([]), do: nil
  defp parse_filters(el) when is_list(el) do
    el
    |> Enum.map(fn x->
      x |> IO.inspect
      parse_filter(x)
    end)
    
  end
  defp parse_filter(%{"raw" => true, "value" => value}), do: value
  defp parse_filter(%{"column" => nil, "operator" => nil, "value" => nil}), do: nil
  defp parse_filter(%{"column" => nil, "operator" => _op, "value" => _val}), do: nil
  defp parse_filter(%{"column" => _col, "operator" => nil, "value" => _val}), do: nil
  defp parse_filter(%{"column" => nil, "operator" => op, "value" => nil}), do: nil
  defp parse_filter(%{"column" => col, "operator" => %{"value" => op_value, "name" => _name}, "value" => val}) do
    col["name"] <> " " <> op_value <> " " <> (val |> parse_filter_value)
  end
  defp parse_filter_value(v), do: "'#{v}'"
  
  defp parse_select([], columns_required) when length(columns_required) == 0, do: "*"
  defp parse_select([], columns_required) when length(columns_required) != 0, do: columns_required
  defp parse_select(el, columns_required) when is_list(el) do
    (el
    |> Enum.map(fn x->
       stringify_select(x, columns_required)
    end)) ++ columns_required |> Enum.uniq
    
  end

  defp stringify_select(%{"raw" => true, "value" => value}, columns_required), do: value
  defp stringify_select(%{"name" => _name, "value" => "raw_data"}, []), do: "*"
  defp stringify_select(%{"name" => _name, "value" => "raw_data"}, columns_required), do: []
  defp stringify_select(%{"name" => _name, "value" => "count"}, columns_required), do: "count"
end
