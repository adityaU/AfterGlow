defmodule AfterGlow.Sql.Adapters.QueryMakers.Mongo do

  @time_intervals %{
    "seconds" => "s",
    "minutes" => "m",
    "hours"  => "h",
    "days"  => "d",
    "weeks"  => "w",
  }

  def mongoql(query_record) do
    # options = options(query_record, :influxdb) |> IO.inspect
    # query = "select #{options[:select] |> Enum.join(", ")} from #{query_record[:table]["readable_table_name"]}"
    # if options[:where] |> length > 0 do
    #   query = "#{query} WHERE #{options[:where] |> Enum.join(" and ")}"
    end

  def query_to_aggregate(query, table, opts) do
    [
      aggregate: ~s/#{table}/,
      pipeline: query,
      maxTimeMS: opts[:timeout]
    ]
  end
end
