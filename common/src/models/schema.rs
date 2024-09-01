diesel::table! {
    app_columns (id) {
        id -> Int8,
        #[max_length = 255]
        name -> Varchar,
        #[max_length = 63]
        real_name -> Varchar,
        description -> Nullable<Text>,
        table_id -> Int8,
        #[max_length = 255]
        type_validation -> Jsonb,
        display_order -> Int4,
        is_primary -> Bool,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    app_tables (id) {
        id -> Int8,
        #[max_length = 255]
        name -> Varchar,
        #[max_length = 63]
        real_name -> Varchar,
        description -> Nullable<Text>,
        app_id -> Int4,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    apps (id) {
        id -> Int4,
        #[max_length = 255]
        name -> Varchar,
        #[max_length = 255]
        schema_name -> Varchar,
        #[max_length = 255]
        color -> Varchar,
        description -> Nullable<Text>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}
