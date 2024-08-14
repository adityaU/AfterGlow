use common::models::app_column::NumberFormats;

use crate::components::base::select::OptionItem;

pub fn number_format_options() -> Vec<OptionItem<NumberFormats, String>> {
    vec![
        OptionItem {
            value: NumberFormats::US,
            label: NumberFormats::US.label(),
        },
        OptionItem {
            value: NumberFormats::DE,
            label: NumberFormats::DE.label(),
        },
        OptionItem {
            value: NumberFormats::FR,
            label: NumberFormats::FR.label(),
        },
        OptionItem {
            value: NumberFormats::NoSeperator,
            label: NumberFormats::NoSeperator.label(),
        },
        OptionItem {
            value: NumberFormats::IN,
            label: NumberFormats::IN.label(),
        },
    ]
}
