defmodule AfterGlow.Alerts.Jobs.AlertEvaluator do
  use Oban.Worker, queue: "alerts", max_attempts: 10
  import Ecto.Query
  alias AfterGlow.Alerts.AlertSettingQueryFunctions, as: AlertSettings
  alias AfterGlow.Alerts.AlertEventQueryFunctions, as: AlertEvents
  alias AfterGlow.Repo
  alias AfterGlow.Questions.DataFetcher

  @operator_methods %{
    greater_than: &Kernel.>/2,
    greater_than_equal_to: &Kernel.>=/2,
    less_than: &Kernel.</2,
    less_than_equal_to: &Kernel.<=/2,
    equal: &Kernel.==/2,
    not_equal_to: &Kernel.!=/2
  }

  def performx(alert_setting_id) do
    Repo.transaction(fn ->
      alert_setting = AlertSettings.get!(alert_setting_id) |> Repo.preload(:question)

      alert_setting.question
      |> DataFetcher.fetch_via_stream_with_default_variables(fn row, column ->
        evaluate(alert_setting, row, column)
      end)
    end)
  end

  def evaluate(alert_setting, rows, columns) do
    value_index =
      columns
      |> Enum.find_index(fn col -> col == alert_setting.column end)

    rows
    |> find_column_value(value_index)
    |> traverse_rows(
      alert_setting.traversal,
      alert_setting.number_of_rows
    )
    |> calculate_aggregation(alert_setting.aggregation)
    |> check_error_level(
      alert_setting.alert_level_settings,
      alert_setting.traversal,
      alert_setting.operation
    )
    |> create_alert_event(
      (alert_setting.aggregation |> to_string()) <> "_" <> alert_setting.column,
      rows |> Stream.flat_map(& &1),
      alert_setting.id
    )
    |> send_notification(alert_setting.alert_notification_settings)
  end

  defp find_column_value(stream, nil), do: []

  defp find_column_value(stream, value_index) do
    stream
    |> Stream.map(fn chunk ->
      chunk
      |> Stream.map(&(&1 |> Enum.at(value_index) |> to_float))
      |> Stream.map(&if &1, do: &1, else: 0)
    end)
  end

  defp traverse_rows(stream, :all, _no_of_rows) do
    [
      stream
      |> Stream.flat_map(fn x -> x end)
    ]
  end

  defp traverse_rows(stream, :any, _no_of_rows) do
    stream |> Stream.flat_map(fn x -> x |> Stream.flat_map(&[[&1]]) end)
  end

  defp traverse_rows(stream, :consecutive, no_of_rows) do
    stream
    |> Stream.flat_map(fn x ->
      x |> Stream.chunk_every(no_of_rows)
    end)
  end

  defp calculate_aggregation(stream, :percentile_90th) do
    stream
    |> Stream.map(fn chunk ->
      chunk |> Enum.to_list() |> Numerix.Statistics.percentile(90)
    end)
  end

  defp calculate_aggregation(stream, :percentile_95th) do
    stream
    |> Stream.map(fn chunk ->
      chunk |> Enum.to_list() |> Numerix.Statistics.percentile(95)
    end)
  end

  defp calculate_aggregation(stream, :percentile_99th) do
    stream
    |> Stream.map(fn chunk ->
      chunk |> Enum.to_list() |> Numerix.Statistics.percentile(99)
    end)
  end

  defp calculate_aggregation(stream, :average) do
    stream
    |> Stream.map(fn chunk ->
      chunk |> Enum.reduce(0, fn acc, val -> acc + val end) |> Kernel./(chunk |> length)
    end)
  end

  defp calculate_aggregation(stream, :min) do
    stream
    |> Stream.map(fn chunk ->
      chunk |> Enum.min()
    end)
  end

  defp calculate_aggregation(stream, :max) do
    stream
    |> Stream.map(fn chunk ->
      chunk |> Enum.max()
    end)
  end

  defp calculate_aggregation(stream, :raw_value) do
    stream |> Stream.flat_map(& &1)
  end

  defp calculate_aggregation(stream, :sum) do
    stream
    |> Stream.map(fn chunk ->
      chunk |> Enum.sum()
    end)
  end

  defp calculate_aggregation(stream, :mean) do
    stream
    |> Stream.map(fn chunk ->
      chunk |> Enum.to_list() |> Numerix.Statistics.mean()
    end)
  end

  defp calculate_aggregation(stream, :median) do
    stream
    |> Stream.map(fn chunk ->
      chunk |> Enum.to_list() |> Numerix.Statistics.median()
    end)
  end

  defp check_error_level(stream, alert_level_settings, traversal, operator) do
    critical_level = alert_level_settings |> Enum.filter(&(&1.level == :critical)) |> Enum.at(0)
    warning_level = alert_level_settings |> Enum.filter(&(&1.level == :warning)) |> Enum.at(0)

    {stream, warning_raised} =
      evaluate_level(stream, traversal, operator, warning_level.value, :warning)

    {stream, critical_raised} =
      evaluate_level(stream, traversal, operator, critical_level.value, :critical)

    {event_level(warning_raised, critical_raised), stream}
  end

  defp evaluate_level(stream, :all, operator, value, level) do
    raised =
      stream
      |> Enum.all?(fn val ->
        apply(@operator_methods[operator], [val, value |> Float.parse() |> elem(0)])
      end)

    stream =
      if raised do
        stream |> Enum.map(fn {val, _lev} -> {val, level} end)
      else
        stream
      end

    {stream, raised}
  end

  defp evaluate_level(stream, _traversal, operator, value, level) do
    stream =
      stream
      |> Enum.to_list()
      |> Enum.map(fn val ->
        if apply(@operator_methods[operator], [val, value |> Float.parse() |> elem(0)]) do
          {val, level}
        else
          {val, :ok}
        end
      end)

    raised = stream |> Enum.any?(fn {_val, lev} -> lev == level end)
    {stream, raised}
  end

  def event_level(true, false), do: :warning
  def event_level(true, true), do: :critical
  def event_level(false, true), do: :critical
  def event_level(false, false), do: :ok

  def create_alert_event(
        {level, transformed_data},
        transformed_data_column_name,
        original_data,
        alert_setting_id
      ) do
    original_data =
      if original_data |> Enum.to_list() |> length >= 5000, do: nil, else: original_data

    is_data_saved = if original_data |> Enum.to_list() |> length >= 5000, do: false, else: true
    previous_event = AlertEvents.get_last(alert_setting_id)

    save_alert_event =
      cond do
        previous_event && previous_event.alert_level != level -> true
        !previous_event && level != :ok -> true
        true -> false
      end

    original_data |> Enum.to_list() |> IO.inspect(level: "original_data")

    if save_alert_event do
      alert_event =
        AlertEvents.create(%{
          alert_level: level,
          transformed_data_column_name: transformed_data_column_name,
          original_data: %{rows: original_data |> Enum.to_list()},
          is_data_saved: is_data_saved,
          alert_setting_id: alert_setting_id
        })

      save_transformed_data(transformed_data, alert_event.id)
      alert_event
    end
  end

  defp save_transformed_data(transformed_data, alert_event_id) do
    transformed_data =
      transformed_data
      |> Enum.map(fn {val, level} ->
        %{value: val, level: level, alert_event_id: alert_event_id}
      end)

    Async.perform(&AlertEventTransformedData.insert_bulk/1, [transformed_data])
  end

  defp send_notification(alert_event, notification_settings) do
    alert_event
  end

  defp to_float(value) when is_float(value), do: value

  defp to_float(value) when is_integer(value),
    do: value |> to_string() |> Float.parse() |> elem(0)

  defp to_float(value) when is_binary(value), do: nil
  defp to_float(value), do: value |> Decimal.to_float()
end
