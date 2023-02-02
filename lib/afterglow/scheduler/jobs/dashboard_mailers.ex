defmodule AfterGlow.Scheduler.Jobs.DashboardMailers do
  import AfterGlow.Users.QueryFunctions, only: [system_user: 0]
  import AfterGlow.Dashboards.QueryFunctions, only: [html: 3]

  def send(id, emails) do
    user = system_user()
    html(id, user, emails)
  end
end
