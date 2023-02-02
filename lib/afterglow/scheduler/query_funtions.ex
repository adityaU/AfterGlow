defmodule AfterGlow.Scheduler.QueryFunctions do
  @model AfterGlow.Scheduler.Schedule
  @default_preloads []
  import Ecto.Query
  import Crontab.CronExpression

  use AfterGlow.Utils.Models.Crud

  alias AfterGlow.Scheduler.Jobs.DashboardMailers
  alias AfterGlow.Teams.QueryFunctions, as: Teams

  @day_number %{
    "Monday" => 1,
    "Tuesday" => 2,
    "Wednesday" => 3,
    "Thursday" => 4,
    "Friday" => 5,
    "Saturday" => 6,
    "Sunday" => 7
  }

  def get_by_dashboard_id(dashboard_id) when is_binary(dashboard_id) do
    id = Integer.parse(dashboard_id) |> elem(0)
    get_by_dashboard_id(id)
  end

  def get_by_dashboard_id(dashboard_id) do
    schedules =
      from(m in @model,
        limit: 1,
        where: fragment("(? ->> 'dashboard_id')::int = ?", m.job_details, ^dashboard_id)
      )
      |> Repo.all()

    if schedules |> length() > 0, do: schedules |> Enum.at(0), else: nil
  end

  def save_for_dashbaord(id, schedule) do
    id = Integer.parse(id) |> elem(0)

    schedule =
      schedule |> Map.merge(%{"job_details" => %{dashboard_id: id, type: "dashboard_mailer"}})

    model = get_by_dashboard_id(id)

    if model do
      {:ok, schedule} = update(model, schedule)
      schedule
    else
      {:ok, schedule} = create(schedule)
      schedule
    end
  end

  def get_all() do
    from(
      m in @model,
      where: fragment("? is not false", m.is_active)
    )
    |> Repo.all()
  end

  def name(schedule, time_detail, :dashboard_mailer) do
    ~s/dashboard_mailer_#{schedule.time_unit}_#{schedule.id}_#{hash(time_detail)}/
  end

  def name(_, _, _), do: nil

  def task(schedule, :dashboard_mailer) do
    dashboard_id = get_in(schedule.job_details, ["dashboard_id"])
    {DashboardMailers, :send, [dashboard_id, recipients(schedule)]}
  end

  def recipients(schedule) do
    schedule.recipients
    |> Enum.map(fn name ->
      team_name = Teams.get_name_from_pseudonym(name)

      if team_name do
        Teams.get_users_by_name(team_name)
        |> Enum.map(& &1.email)
      else
        [name]
      end
    end)
    |> List.flatten()
  end

  def jobs(schedule) do
    schedule.time_details
    |> Enum.map(fn time_detail ->
      time_unit = schedule.time_unit |> String.downcase() |> String.to_atom()

      %{
        name: name(schedule, time_detail, schedule.job_details["type"] |> String.to_atom()),
        cron: cron_expression(time_detail, schedule.every, time_unit),
        apply: should_apply(time_unit, schedule),
        timezone: schedule.timezone,
        task: task(schedule, schedule.job_details["type"] |> String.to_atom())
      }
    end)
  end

  defp should_apply(:week, schedule) do
    rem(Timex.now(schedule.timezone).week(), schedule.every) == 0
  end

  defp should_apply(_, _), do: true

  defp cron_expression(time_detail, every, :hour) do
    ~e/0 #{time_detail["minute"]} *\/#{every}/e
  end

  defp cron_expression(time_detail, every, :day) do
    ~e[0 #{time_detail["minute"]} #{convert_hour(time_detail["hour"], time_detail["am"])} */#{every}]e
  end

  defp cron_expression(time_detail, _every, :week) do
    ~e/0 #{time_detail["minute"]} #{convert_hour(time_detail["hour"], time_detail["am"])} * * #{@day_number[time_detail["day"]]}/e
  end

  defp cron_expression(time_detail, every, :month) do
    ~e/0 #{time_detail["minute"]} #{convert_hour(time_detail["hour"], time_detail["am"])} #{time_detail["date"]} *\/#{every}/e
  end

  defp convert_hour(hour, am) do
    hour = if am == "AM", do: hour, else: hour + 12
    hour = if am == "AM" && hour == 12, do: 0, else: hour
    hour = if hour >= 24, do: 0, else: hour
    hour
  end

  defp hash(time_detail) do
    :crypto.hash(:sha256, Jason.encode!(time_detail))
    |> Base.encode16()
    |> String.downcase()
    |> String.slice(0, 10)
  end

  # def next_schedule_time(every, time_unit, time_details, timezone, first \\ false) do
  #   time_unit = time_unit |> String.downcase() |> String.to_atom()
  #   current_time = Timex.now()

  #   possibilities =
  #     time_details
  #     |> Enum.map(fn det ->
  #       initial_time(time_unit, first, det, current_time, every, timezone)
  #     end)
  #     |> IO.inspect(label: "possibilities")

  #   current_time =
  #     time_with_offset(current_time, timezone, time_unit)
  #     |> IO.inspect(label: "current_time timezone")

  #   find_nearest(possibilities, current_time, time_unit)
  #   |> IO.inspect(label: "final")
  # end

  # defp add_duration(time, time_unit, every \\ 1) do
  #   case time_unit do
  #     :day -> Timex.add(time, Timex.Duration.from_days(every))
  #     :week -> Timex.add(time, Timex.Duration.from_weeks(every))
  #     :hour -> Timex.add(time, Timex.Duration.from_hours(every))
  #     :month -> Timex.shift(time, months: every)
  #   end
  # end

  # defp reset_time_offset(time, timezone, :hour) do
  #   time
  #   |> Timex.add(Timex.Duration.from_minutes(rem(Integer.parse(timezone) |> elem(0), 60)))
  # end

  # defp reset_time_offset(time, timezone, _) do
  #   time
  #   |> Timex.add(Timex.Duration.from_minutes(Integer.parse(timezone) |> elem(0)))
  # end

  # defp time_with_offset(time, timezone, :hour) do
  #   time
  #   |> Timex.subtract(Timex.Duration.from_minutes(rem(Integer.parse(timezone) |> elem(0), 60)))
  # end

  # defp time_with_offset(time, timezone, _) do
  #   time
  #   |> Timex.subtract(Timex.Duration.from_minutes(Integer.parse(timezone) |> elem(0)))
  # end

  # defp initial_time(:hour, true, opts, current_time, _every, timezone) do
  #   Timex.to_datetime(
  #     {{current_time.year, current_time.month, current_time.day},
  #      {current_time.hour, opts["minute"], 0}}
  #   )
  #   |> time_with_offset(timezone, :hour)
  # end

  # defp initial_time(:day, true, opts, current_time, _every, timezone) do
  #   hour = convert_hour(opts["hour"], opts["am"])

  #   Timex.to_datetime(
  #     {{current_time.year, current_time.month, current_time.day}, {hour, opts["minute"], 0}}
  #   )
  #   |> IO.inspect(label: "yo")
  #   |> time_with_offset(timezone, :day)
  # end

  # defp initial_time(unit, false, opts, current_time, every, timezone) do
  #   initial_time(unit, true, opts, current_time, every, timezone)
  #   |> add_duration(every)
  # end

  # defp find_nearest(times, curr_time, time_unit) do
  #   diff =
  #     times
  #     |> Enum.map(fn time ->
  #       Timex.diff(time, curr_time, :seconds)
  #     end)
  #     |> Enum.filter(&(&1 >= 0))

  #   min =
  #     if diff |> length() > 0 do
  #       diff |> Enum.min()
  #     else
  #       -1
  #     end
  #     |> IO.inspect(label: "min")

  #   if min < 0 do
  #     min =
  #       times
  #       |> Enum.map(fn time ->
  #         Timex.diff(
  #           add_duration(time, time_unit) |> IO.inspect(label: "New_times"),
  #           curr_time,
  #           :seconds
  #         )
  #       end)
  #       |> Enum.min()

  #     Timex.add(curr_time, Timex.Duration.from_seconds(min + 1))
  #   else
  #     Timex.add(curr_time, Timex.Duration.from_seconds(min + 1))
  #   end
  # end
end
