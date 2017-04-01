defmodule SimpleBase.Repo.Migrations.CreateSendAlertConfig do
  use Ecto.Migration

  def change do
    create table(:send_alert_configs) do
      add :alert_id, references(:alerts)
      add :message_template, :string
      add :comm_type, :integer
      add :to_addresses, {:array, :string}
      add :subject_template, :string
      timestamps()
    end


  end
end
