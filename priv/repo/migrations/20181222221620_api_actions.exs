defmodule AfterGlow.Repo.Migrations.ApiActions do
  use Ecto.Migration

  def change do
    create table(:api_actions) do
      add(:question_id, references(:questions, on_delete: :delete_all))
      add(:url, :text, null: false)
      add(:headers, :jsonb)
      add(:body, :text)
      add(:method, :integer)
      add(:name, :string)
      add(:color, :string)
      add(:open_in_new_tab, :boolean)
      add(:response_settings, :map)
      add(:hidden, :boolean)
      timestamps()
    end

    create table(:api_action_logs) do
      add(:api_action_id, references(:api_actions, on_delete: :delete_all))
      add(:url, :text, null: false)
      add(:request_headers, :jsonb)
      add(:response_headers, :jsonb)
      add(:request_body, :text)
      add(:response_body, :text)
      add(:request_method, :integer)
      add(:status_code, :integer)
      add(:variables, {:array, :string})
      add(:user_id, references(:users))
      timestamps()
    end
  end
end
