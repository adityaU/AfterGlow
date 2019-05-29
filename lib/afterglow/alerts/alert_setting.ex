defmodule AfterGlow.Alerts.AlertSetting do
  use Ecto.Schema
  alias Ecto.Changeset
  import EctoEnum
  alias AfterGlow.Question
  alias AfterGlow.Alerts.AlertLevelSetting
  alias AfterGlow.Alerts.AlertNotificationSetting

  defenum(AggregationEnum,
    raw_value: 1,
    average: 2,
    median: 3,
    min: 4,
    max: 5,
    sum: 6,
    mean: 7,
    percentile_90th: 8,
    percentile_95th: 9,
    percentile_99th: 10
  )

  defenum(OperationEnum,
    greater_than: 1,
    greater_than_equal_to: 2,
    less_than: 3,
    less_than_equal_to: 4,
    equal: 5,
    not_equal_to: 6
  )

  defenum(TraversalEnum,
    any: 1,
    all: 2,
    consecutive: 3
  )

  defenum(StatusEnum, idle: 1, running: 2)

  @cast_params [
    :name,
    :question_id,
    :column,
    :aggregation,
    :number_of_rows,
    :operation,
    :traversal,
    :is_active,
    :frequency_value_in_seconds,
    :start_time,
    :scheduled_disabled_config,
    :silent_till
  ]

  @required_params @cast_params -- [:scheduled_disabled_config, :silent_till]

  schema("alert_settings") do
    field(:name, :string)
    belongs_to(:question, Question)
    field(:column, :string)
    field(:aggregation, AggregationEnum)
    field(:number_of_rows, :integer)
    field(:operation, OperationEnum)
    field(:traversal, TraversalEnum)
    field(:is_active, :boolean, default: true)
    field(:frequency_value_in_seconds, :integer)
    field(:start_time, :utc_datetime)
    field(:scheduled_disabled_config, :map)
    field(:silent_till, :utc_datetime)
    field(:next_run_time, :utc_datetime)
    field(:status, StatusEnum)
    has_many(:alert_level_settings, AlertLevelSetting, on_delete: :delete_all)
    has_many(:alert_notification_settings, AlertNotificationSetting, on_delete: :delete_all)
    timestamps()
  end

  def changeset(%__MODULE__{} = struct, attrs) do
    attrs |> IO.inspect(label: "alert attrs")

    struct
    |> Changeset.cast(attrs, @cast_params)
    |> Changeset.validate_required(@required_params)
  end
end
