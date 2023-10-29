defmodule AfterGlow.Scheduler.Jobs.CronScheduler do
  alias AfterGlow.Scheduler.QueryFunctions, as: Schedule
  alias AfterGlow.Scheduler

  alias AfterGlow.Scheduler.Jobs.DashboardMailers

  def run() do
    namespace = "AG:Scheduled::"
    reg = ~r/^#{namespace}/

    current_jobs =
      Scheduler.jobs()
      |> Enum.map(&(&1 |> elem(1)))
      |> Enum.filter(&String.match?(&1.name |> to_string(), reg))

    # |> IO.inspect(label: "current jobs==============================")

    schedules =
      Schedule.get_all()
      |> Enum.map(fn schedule ->
        schedule |> Schedule.jobs()
      end)
      |> List.flatten()
      |> Enum.filter(& &1.name)
      |> Enum.map(&(&1 |> Map.merge(%{name: (namespace <> &1.name) |> String.to_atom()})))

    schedules_map = schedules |> Map.new(fn m -> {m.name, m} end)

    to_be_removed =
      current_jobs
      |> Enum.map(& &1.name)
      |> Kernel.--(schedules |> Enum.filter(& &1.apply) |> Enum.map(& &1.name))

    to_be_added =
      schedules
      |> Enum.filter(& &1.apply)
      |> Enum.map(& &1.name)
      |> Kernel.--(
        current_jobs
        |> Enum.map(& &1.name)
      )

    to_be_removed
    |> Enum.each(fn j ->
      Scheduler.delete_job(j)
    end)

    to_be_added
    |> Enum.each(fn j ->
      job = schedules_map[j]

      Scheduler.new_job()
      |> Quantum.Job.set_name(job.name)
      |> Quantum.Job.set_schedule(job.cron)
      |> Quantum.Job.set_timezone(job.timezone)
      |> Quantum.Job.set_task(job.task)
      |> Scheduler.add_job()
    end)
  end
end
