// @generated automatically by Diesel CLI.

pub mod sql_types {
    #[derive(diesel::sql_types::SqlType)]
    #[diesel(postgres_type(name = "oban_job_state"))]
    pub struct ObanJobState;
}

diesel::table! {
    alert_events (id) {
        id -> Int8,
        alert_setting_id -> Int8,
        alert_level -> Int4,
        original_data -> Nullable<Jsonb>,
        #[max_length = 255]
        transformed_data_column_name -> Nullable<Varchar>,
        is_data_saved -> Bool,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    alert_events_transformed_data (id) {
        id -> Int8,
        #[max_length = 255]
        value -> Nullable<Varchar>,
        level -> Int4,
        alert_event_id -> Int8,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    alert_level_settings (id) {
        id -> Int8,
        level -> Int4,
        #[max_length = 255]
        value -> Varchar,
        alert_setting_id -> Int8,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    alert_notification_settings (id) {
        id -> Int8,
        method -> Int4,
        recipients -> Array<Nullable<Varchar>>,
        alert_setting_id -> Int8,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    alert_settings (id) {
        id -> Int8,
        #[max_length = 255]
        name -> Varchar,
        question_id -> Int8,
        #[max_length = 255]
        column -> Varchar,
        aggregation -> Int4,
        number_of_rows -> Int4,
        operation -> Int4,
        traversal -> Int4,
        is_active -> Bool,
        frequency_value_in_seconds -> Int4,
        start_time -> Timestamp,
        scheduled_disabled_config -> Nullable<Jsonb>,
        silent_till -> Nullable<Timestamp>,
        next_run_time -> Nullable<Timestamp>,
        status -> Nullable<Int4>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    alerts (id) {
        id -> Int8,
        #[max_length = 255]
        name -> Nullable<Varchar>,
        config -> Nullable<Jsonb>,
        question_id -> Nullable<Int8>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    api_action_logs (id) {
        id -> Int8,
        api_action_id -> Nullable<Int8>,
        url -> Text,
        request_headers -> Nullable<Jsonb>,
        response_headers -> Nullable<Jsonb>,
        request_body -> Nullable<Text>,
        response_body -> Nullable<Text>,
        request_method -> Nullable<Int4>,
        status_code -> Nullable<Int4>,
        variables -> Nullable<Array<Nullable<Varchar>>>,
        user_id -> Nullable<Int8>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    api_actions (id) {
        id -> Int8,
        question_id -> Nullable<Int8>,
        url -> Text,
        headers -> Nullable<Jsonb>,
        body -> Nullable<Text>,
        method -> Nullable<Int4>,
        #[max_length = 255]
        name -> Nullable<Varchar>,
        #[max_length = 255]
        color -> Nullable<Varchar>,
        open_in_new_tab -> Nullable<Bool>,
        response_settings -> Nullable<Jsonb>,
        hidden -> Nullable<Bool>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
        #[max_length = 255]
        column -> Nullable<Varchar>,
        on_success -> Nullable<Int4>,
        on_failure -> Nullable<Int4>,
        #[max_length = 255]
        failure_message -> Nullable<Varchar>,
        #[max_length = 255]
        failure_key -> Nullable<Varchar>,
        #[max_length = 255]
        success_message -> Nullable<Varchar>,
        #[max_length = 255]
        success_key -> Nullable<Varchar>,
        action_level -> Nullable<Int4>,
        visualization_id -> Nullable<Int4>,
        loading_message -> Nullable<Text>,
        display_settings -> Nullable<Jsonb>,
        #[max_length = 255]
        open_option -> Nullable<Varchar>,
    }
}

diesel::table! {
    applications (id) {
        id -> Int8,
        #[max_length = 255]
        name -> Varchar,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    audit_logs (id) {
        id -> Int8,
        whodunit -> Nullable<Int4>,
        action -> Nullable<Int4>,
        additional_data -> Nullable<Jsonb>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    bg_queue (id) {
        id -> Uuid,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
        scheduled_for -> Timestamp,
        failed_attempts -> Int4,
        status -> Int4,
        message -> Jsonb,
        #[max_length = 255]
        name -> Nullable<Varchar>,
    }
}

diesel::table! {
    column_values (id) {
        id -> Int8,
        #[max_length = 255]
        name -> Nullable<Varchar>,
        #[max_length = 255]
        value -> Nullable<Varchar>,
        column_id -> Nullable<Int8>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    #[sql_name = "columns"]
    columns_ (id) {
        id -> Int8,
        #[max_length = 255]
        name -> Nullable<Varchar>,
        table_id -> Nullable<Int8>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
        #[max_length = 255]
        data_type -> Nullable<Varchar>,
        #[max_length = 255]
        description -> Nullable<Varchar>,
        primary_key -> Nullable<Bool>,
    }
}

diesel::table! {
    dashboard_widgets (id) {
        id -> Int8,
        #[max_length = 255]
        widget_type -> Nullable<Varchar>,
        widget_id -> Nullable<Int8>,
        dashboard_id -> Nullable<Int8>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    dashboards (id) {
        id -> Int8,
        #[max_length = 255]
        title -> Nullable<Varchar>,
        update_interval -> Nullable<Int4>,
        last_updated -> Nullable<Timestamp>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
        description -> Nullable<Text>,
        shareable_link -> Nullable<Uuid>,
        is_shareable_link_public -> Nullable<Bool>,
        settings -> Nullable<Jsonb>,
        shared_to -> Nullable<Array<Nullable<Varchar>>>,
        owner_id -> Nullable<Int8>,
        notes_settings -> Nullable<Jsonb>,
    }
}

diesel::table! {
    databases (id) {
        id -> Int8,
        #[max_length = 255]
        name -> Nullable<Varchar>,
        #[max_length = 255]
        db_type -> Nullable<Varchar>,
        config -> Nullable<Jsonb>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
        last_accessed_at -> Nullable<Timestamp>,
        unique_identifier -> Nullable<Uuid>,
    }
}

diesel::table! {
    foreign_keys (id) {
        id -> Int8,
        #[max_length = 255]
        name -> Nullable<Varchar>,
        fk_type -> Nullable<Int4>,
        column_id -> Nullable<Int8>,
        foreign_column_id -> Nullable<Int8>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    generated_alerts (id) {
        id -> Int8,
        alert_id -> Nullable<Int8>,
        status -> Nullable<Int4>,
        failing_conditions -> Nullable<Array<Nullable<Jsonb>>>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    notes (id) {
        id -> Int8,
        content -> Text,
        dashboard_id -> Nullable<Int8>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    use diesel::sql_types::*;
    use super::sql_types::ObanJobState;

    oban_jobs (id) {
        id -> Int8,
        state -> ObanJobState,
        queue -> Text,
        worker -> Text,
        args -> Jsonb,
        errors -> Array<Nullable<Jsonb>>,
        attempt -> Int4,
        max_attempts -> Int4,
        inserted_at -> Timestamp,
        scheduled_at -> Timestamp,
        attempted_at -> Nullable<Timestamp>,
        completed_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    organization_settings (id) {
        id -> Int8,
        #[max_length = 255]
        name -> Varchar,
        #[max_length = 255]
        value -> Nullable<Varchar>,
        setting_type -> Int4,
        organization_id -> Int8,
        api_action_id -> Nullable<Int8>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    organizations (id) {
        id -> Int8,
        #[max_length = 255]
        name -> Varchar,
        #[max_length = 255]
        google_domain -> Varchar,
        is_deactivated -> Bool,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    permission_sets (id) {
        id -> Int8,
        #[max_length = 255]
        name -> Nullable<Varchar>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    permissions (id) {
        id -> Int8,
        permission_set_id -> Nullable<Int8>,
        #[max_length = 255]
        name -> Nullable<Varchar>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    question_banks (id) {
        id -> Int8,
        #[max_length = 255]
        title -> Nullable<Varchar>,
        questions -> Nullable<Array<Nullable<Int4>>>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    question_widgets (id) {
        id -> Int8,
        widget_id -> Nullable<Int8>,
        question_id -> Nullable<Int8>,
    }
}

diesel::table! {
    questions (id) {
        id -> Int8,
        #[max_length = 255]
        title -> Nullable<Varchar>,
        last_updated -> Nullable<Timestamp>,
        sql -> Nullable<Text>,
        human_sql -> Nullable<Jsonb>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
        query_type -> Nullable<Int4>,
        shareable_link -> Nullable<Uuid>,
        is_shareable_link_public -> Nullable<Bool>,
        results_view_settings -> Nullable<Jsonb>,
        #[sql_name = "columns"]
        columns_ -> Nullable<Array<Nullable<Varchar>>>,
        cached_results -> Nullable<Jsonb>,
        shared_to -> Nullable<Array<Nullable<Varchar>>>,
        owner_id -> Nullable<Int8>,
        config -> Nullable<Jsonb>,
    }
}

diesel::table! {
    results_cache (id) {
        id -> Int8,
        #[max_length = 255]
        key -> Nullable<Varchar>,
        sql -> Nullable<Text>,
        data -> Nullable<Jsonb>,
        expiry_time -> Nullable<Timestamp>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    rules_engine_permissions (id) {
        id -> Int8,
        role_id -> Int8,
        name -> Int4,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    rules_engine_roles (id) {
        id -> Int8,
        #[max_length = 255]
        name -> Varchar,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    rules_engine_users (id) {
        id -> Int8,
        #[max_length = 255]
        name -> Nullable<Varchar>,
        #[max_length = 255]
        email -> Varchar,
        is_deactivated -> Bool,
        #[max_length = 255]
        profile_pic -> Nullable<Varchar>,
        metadata -> Nullable<Jsonb>,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    schedules (id) {
        id -> Int8,
        every -> Nullable<Int4>,
        #[max_length = 255]
        time_unit -> Nullable<Varchar>,
        time_details -> Nullable<Array<Nullable<Jsonb>>>,
        next_execution_time -> Nullable<Timestamp>,
        is_running -> Nullable<Bool>,
        job_details -> Nullable<Jsonb>,
        is_active -> Nullable<Bool>,
        recipients -> Nullable<Array<Nullable<Varchar>>>,
        #[max_length = 255]
        timezone -> Nullable<Varchar>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
        #[max_length = 255]
        subject -> Nullable<Varchar>,
    }
}

diesel::table! {
    searchable_columns (id) {
        id -> Int8,
        #[max_length = 255]
        name -> Nullable<Varchar>,
        snapshot_id -> Nullable<Int8>,
        value -> Nullable<Text>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
        snapshot_data_identifier -> Nullable<Uuid>,
    }
}

diesel::table! {
    send_alert_configs (id) {
        id -> Int8,
        alert_id -> Nullable<Int8>,
        #[max_length = 255]
        message_template -> Nullable<Varchar>,
        comm_type -> Nullable<Int4>,
        to_addresses -> Nullable<Array<Nullable<Varchar>>>,
        #[max_length = 255]
        subject_template -> Nullable<Varchar>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    settings (id) {
        id -> Int8,
        #[max_length = 255]
        name -> Varchar,
        value -> Nullable<Text>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    sheet_configs (id) {
        id -> Int8,
        #[max_length = 255]
        name -> Nullable<Varchar>,
        #[max_length = 255]
        table_name -> Nullable<Varchar>,
        refresh_interval -> Nullable<Int4>,
        #[max_length = 255]
        sheet_id -> Nullable<Varchar>,
        subsheet_id -> Nullable<Int8>,
        api_key_id -> Nullable<Int8>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    snapshot_data (id) {
        id -> Int8,
        row -> Jsonb,
        snapshot_id -> Nullable<Int8>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
        identifier -> Nullable<Uuid>,
    }
}

diesel::table! {
    snapshots (id) {
        id -> Int8,
        #[max_length = 255]
        name -> Varchar,
        #[max_length = 255]
        description -> Nullable<Varchar>,
        #[sql_name = "columns"]
        columns_ -> Nullable<Array<Nullable<Varchar>>>,
        question_id -> Int8,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
        scheduled -> Nullable<Bool>,
        interval -> Nullable<Int4>,
        starting_at -> Nullable<Timestamp>,
        status -> Nullable<Int4>,
        should_save_data_to_db -> Nullable<Bool>,
        should_create_csv -> Nullable<Bool>,
        should_send_mail_on_completion -> Nullable<Bool>,
        mail_to -> Nullable<Array<Nullable<Varchar>>>,
        parent_id -> Nullable<Int8>,
        searchable_columns -> Nullable<Array<Nullable<Varchar>>>,
        keep_latest -> Nullable<Int4>,
    }
}

diesel::table! {
    snippets (id) {
        id -> Int8,
        #[max_length = 255]
        name -> Nullable<Varchar>,
        text -> Nullable<Text>,
        database_id -> Nullable<Int8>,
        owner_id -> Nullable<Int8>,
        expand_on_select -> Nullable<Bool>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    tables (id) {
        id -> Int8,
        #[max_length = 255]
        name -> Nullable<Varchar>,
        database_id -> Nullable<Int8>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
        #[max_length = 255]
        readable_table_name -> Nullable<Varchar>,
        #[max_length = 255]
        description -> Nullable<Varchar>,
    }
}

diesel::table! {
    tag_dashboards (id) {
        id -> Int8,
        tag_id -> Nullable<Int8>,
        dashboard_id -> Nullable<Int8>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    tag_questions (id) {
        id -> Int8,
        tag_id -> Nullable<Int8>,
        question_id -> Nullable<Int8>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    tags (id) {
        id -> Int8,
        #[max_length = 255]
        name -> Varchar,
        #[max_length = 255]
        description -> Nullable<Varchar>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
        #[max_length = 255]
        color -> Nullable<Varchar>,
    }
}

diesel::table! {
    team_databases (id) {
        id -> Int8,
        database_id -> Nullable<Int8>,
        team_id -> Nullable<Int8>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    teams (id) {
        id -> Int8,
        #[max_length = 255]
        name -> Varchar,
        description -> Nullable<Text>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    user_permission_sets (id) {
        id -> Int8,
        user_id -> Nullable<Int8>,
        permission_set_id -> Nullable<Int8>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    user_settings (id) {
        id -> Int8,
        #[max_length = 255]
        name -> Varchar,
        #[max_length = 255]
        value -> Nullable<Varchar>,
        setting_type -> Int4,
        user_id -> Int8,
        api_action_id -> Nullable<Int8>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    user_teams (id) {
        id -> Int8,
        user_id -> Nullable<Int8>,
        team_id -> Nullable<Int8>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    users (id) {
        id -> Int8,
        #[max_length = 255]
        first_name -> Nullable<Varchar>,
        #[max_length = 255]
        last_name -> Nullable<Varchar>,
        #[max_length = 255]
        email -> Nullable<Varchar>,
        #[max_length = 255]
        full_name -> Nullable<Varchar>,
        #[max_length = 255]
        profile_pic -> Nullable<Varchar>,
        metadata -> Nullable<Jsonb>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
        is_deactivated -> Nullable<Bool>,
        organization_id -> Nullable<Int8>,
        password -> Nullable<Text>,
    }
}

diesel::table! {
    variables (id) {
        id -> Int8,
        #[max_length = 255]
        name -> Nullable<Varchar>,
        #[max_length = 255]
        default -> Nullable<Varchar>,
        #[max_length = 255]
        var_type -> Nullable<Varchar>,
        column_id -> Nullable<Int8>,
        question_id -> Nullable<Int8>,
        dashboard_id -> Nullable<Int8>,
        #[max_length = 255]
        default_operator -> Nullable<Varchar>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
        question_filter_id -> Nullable<Int8>,
        default_options -> Nullable<Array<Nullable<Jsonb>>>,
    }
}

diesel::table! {
    visualizations (id) {
        id -> Int8,
        #[max_length = 255]
        name -> Nullable<Varchar>,
        settings -> Nullable<Jsonb>,
        query_terms -> Nullable<Jsonb>,
        #[max_length = 255]
        renderer_type -> Nullable<Varchar>,
        question_id -> Nullable<Int8>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    widget_items (id) {
        id -> Int8,
        #[max_length = 255]
        text -> Nullable<Varchar>,
        config -> Nullable<Jsonb>,
        #[max_length = 255]
        value -> Nullable<Varchar>,
        widget_id -> Nullable<Int8>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    widgets (id) {
        id -> Int8,
        #[max_length = 255]
        column_name -> Varchar,
        #[max_length = 255]
        name -> Varchar,
        renderer -> Nullable<Int4>,
        inserted_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::joinable!(alert_events -> alert_settings (alert_setting_id));
diesel::joinable!(alert_events_transformed_data -> alert_events (alert_event_id));
diesel::joinable!(alert_level_settings -> alert_settings (alert_setting_id));
diesel::joinable!(alert_notification_settings -> alert_settings (alert_setting_id));
diesel::joinable!(alert_settings -> questions (question_id));
diesel::joinable!(alerts -> questions (question_id));
diesel::joinable!(api_action_logs -> users (user_id));
diesel::joinable!(api_actions -> questions (question_id));
diesel::joinable!(column_values -> columns_ (column_id));
diesel::joinable!(columns_ -> tables (table_id));
diesel::joinable!(dashboard_widgets -> dashboards (dashboard_id));
diesel::joinable!(dashboards -> users (owner_id));
diesel::joinable!(generated_alerts -> alerts (alert_id));
diesel::joinable!(notes -> dashboards (dashboard_id));
diesel::joinable!(organization_settings -> api_actions (api_action_id));
diesel::joinable!(organization_settings -> organizations (organization_id));
diesel::joinable!(permissions -> permission_sets (permission_set_id));
diesel::joinable!(question_widgets -> questions (question_id));
diesel::joinable!(question_widgets -> widgets (widget_id));
diesel::joinable!(questions -> users (owner_id));
diesel::joinable!(rules_engine_permissions -> rules_engine_roles (role_id));
diesel::joinable!(searchable_columns -> snapshots (snapshot_id));
diesel::joinable!(send_alert_configs -> alerts (alert_id));
diesel::joinable!(sheet_configs -> user_settings (api_key_id));
diesel::joinable!(snapshot_data -> snapshots (snapshot_id));
diesel::joinable!(snapshots -> questions (question_id));
diesel::joinable!(snippets -> databases (database_id));
diesel::joinable!(snippets -> users (owner_id));
diesel::joinable!(tables -> databases (database_id));
diesel::joinable!(tag_dashboards -> dashboards (dashboard_id));
diesel::joinable!(tag_dashboards -> tags (tag_id));
diesel::joinable!(tag_questions -> questions (question_id));
diesel::joinable!(tag_questions -> tags (tag_id));
diesel::joinable!(team_databases -> databases (database_id));
diesel::joinable!(team_databases -> teams (team_id));
diesel::joinable!(user_permission_sets -> permission_sets (permission_set_id));
diesel::joinable!(user_permission_sets -> users (user_id));
diesel::joinable!(user_settings -> api_actions (api_action_id));
diesel::joinable!(user_settings -> users (user_id));
diesel::joinable!(user_teams -> teams (team_id));
diesel::joinable!(user_teams -> users (user_id));
diesel::joinable!(users -> organizations (organization_id));
diesel::joinable!(variables -> columns_ (column_id));
diesel::joinable!(variables -> dashboards (dashboard_id));
diesel::joinable!(visualizations -> questions (question_id));
diesel::joinable!(widget_items -> widgets (widget_id));

diesel::allow_tables_to_appear_in_same_query!(
    alert_events,
    alert_events_transformed_data,
    alert_level_settings,
    alert_notification_settings,
    alert_settings,
    alerts,
    api_action_logs,
    api_actions,
    applications,
    audit_logs,
    bg_queue,
    column_values,
    columns_,
    dashboard_widgets,
    dashboards,
    databases,
    foreign_keys,
    generated_alerts,
    notes,
    oban_jobs,
    organization_settings,
    organizations,
    permission_sets,
    permissions,
    question_banks,
    question_widgets,
    questions,
    results_cache,
    rules_engine_permissions,
    rules_engine_roles,
    rules_engine_users,
    schedules,
    searchable_columns,
    send_alert_configs,
    settings,
    sheet_configs,
    snapshot_data,
    snapshots,
    snippets,
    tables,
    tag_dashboards,
    tag_questions,
    tags,
    team_databases,
    teams,
    user_permission_sets,
    user_settings,
    user_teams,
    users,
    variables,
    visualizations,
    widget_items,
    widgets,
);
