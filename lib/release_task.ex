defmodule AfterGlow.ReleaseTasks do
  def migrate do
    {:ok, _} = Application.ensure_all_started(:afterglow)

    path = Application.app_dir(:afterglow, "priv/repo/migrations")

    Ecto.Migrator.run(AfterGlow.Repo, path, :up, all: true)
  end

  def seed do
    {:ok, _} = Application.ensure_all_started(:afterglow)
    path = Application.app_dir(:afterglow, "priv/repo/seeds.exs")

    if File.exists?(path) do
      IO.puts("Running seed script..")
      Code.eval_file(path)
    end
  end
end
