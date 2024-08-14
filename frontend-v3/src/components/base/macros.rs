#[macro_export]
macro_rules! create_derived_memo {
    ($signal:ident, $type_name:path, $field_name:ident, $default:expr) => {
        create_memo(move |_| {
            if let Some($type_name { $field_name, .. }) = $signal.get() {
                $field_name
            } else {
                $default
            }
        })
    };
}

#[macro_export]
macro_rules! create_updater_func {
    ($read_signal:ident, $write_signal:ident, $type_name:path, $field_name:ident) => {
        move |new_value| {
            if let Some($type_name { .. }) = $read_signal.get() {
                $write_signal.update(|tv| {
                    if let Some($type_name {
                        $field_name: ref mut field_ref,
                        ..
                    }) = tv
                    {
                        *field_ref = new_value;
                    }
                });
            }
        }
    };
}

#[macro_export]
macro_rules! create_derived_memo_with_option {
    ($signal:ident, $type_name:path, $field_name:ident, $default:expr) => {
        create_memo(move |_| {
            if let Some($type_name { $field_name, .. }) = $signal.get() {
                Some($field_name)
            } else {
                $default
            }
        })
    };
}

#[macro_export]
macro_rules! create_updater_func_with_option {
    ($read_signal:ident, $write_signal:ident, $type_name:path, $field_name:ident, $field_type:path) => {
        move |new_value: Option<$field_type>| {
            if let Some($type_name { .. }) = $read_signal.get() {
                $write_signal.update(|tv| {
                    if let Some($type_name {
                        $field_name: ref mut field_ref,
                        ..
                    }) = tv
                    {
                        *field_ref = new_value.unwrap_or_default();
                    }
                });
            }
        }
    };
}

#[macro_export]
macro_rules! base_comp_attributes_with_options {
    ($read_signal:ident, $write_signal:ident, $type_name:path, $field_name:ident, $field_type:path, $default:ident) => {
        move || {
            let memo =
                create_derived_memo_with_option!($read_signal, $type_name, $field_name, $default);
            let updater_func = create_updater_func_with_option!(
                $read_signal,
                $write_signal,
                $type_name,
                $field_name,
                $field_type
            );
            let (error_message, set_error_message) = create_signal(None::<String>);
            (memo, updater_func, error_message, set_error_message)
        }
    };
}

#[macro_export]
macro_rules! base_comp_attributes {
    ($read_signal:ident, $write_signal:ident, $type_name:path, $field_name:ident, $default:ident) => {
        move || {
            let memo = create_derived_memo!($read_signal, $type_name, $field_name, $default);
            let updater_func =
                create_updater_func!($read_signal, $write_signal, $type_name, $field_name);
            let (error_message, set_error_message) = create_signal(None::<String>);
            (memo, updater_func, error_message, set_error_message)
        }
    };
}
