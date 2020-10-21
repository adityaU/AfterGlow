defmodule AfterGlow.GoogleSheets.GoogleSheet do
  use Ecto.Schema
  import Ecto.Changeset
  alias AfterGlow.GoogleSheets.GoogleSheet


  schema "sheet_configs" do
    field :name, :string
    field :refresh_interval, :integer
    field :sheet_id, :string
    field :subsheet_id, :integer
    field :table_name, :string
    field :api_key_id, :id

    timestamps()
  end

  @doc false
  def changeset(%GoogleSheet{} = google_sheet, attrs) do
    google_sheet
    |> cast(attrs, [:name, :table_name, :refresh_interval, :sheet_id, :subsheet_id])
    |> validate_required([:name, :table_name, :refresh_interval, :sheet_id, :subsheet_id])
  end
end
