DO $$ BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'questions') THEN




SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
-- SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;





CREATE EXTENSION IF NOT EXISTS btree_gist WITH SCHEMA public;






COMMENT ON EXTENSION btree_gist IS 'support for indexing common datatypes in GiST';






CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;






COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';






CREATE TYPE public.oban_job_state AS ENUM (
    'available',
    'scheduled',
    'executing',
    'retryable',
    'completed',
    'discarded'
);










SET default_tablespace = '';

SET default_table_access_method = heap;












CREATE TABLE public.alert_events (
    id bigint NOT NULL,
    alert_setting_id bigint NOT NULL,
    alert_level integer NOT NULL,
    original_data jsonb,
    transformed_data_column_name character varying(255),
    is_data_saved boolean DEFAULT true NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);








CREATE SEQUENCE public.alert_events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.alert_events_id_seq OWNED BY public.alert_events.id;






CREATE TABLE public.alert_events_transformed_data (
    id bigint NOT NULL,
    value character varying(255),
    level integer NOT NULL,
    alert_event_id bigint NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);





CREATE SEQUENCE public.alert_events_transformed_data_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;




ALTER SEQUENCE public.alert_events_transformed_data_id_seq OWNED BY public.alert_events_transformed_data.id;




CREATE TABLE public.alert_level_settings (
    id bigint NOT NULL,
    level integer NOT NULL,
    value character varying(255) NOT NULL,
    alert_setting_id bigint NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);





CREATE SEQUENCE public.alert_level_settings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;






ALTER SEQUENCE public.alert_level_settings_id_seq OWNED BY public.alert_level_settings.id;



CREATE TABLE public.alert_notification_settings (
    id bigint NOT NULL,
    method integer NOT NULL,
    recipients character varying(255)[] NOT NULL,
    alert_setting_id bigint NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);




CREATE SEQUENCE public.alert_notification_settings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;





ALTER SEQUENCE public.alert_notification_settings_id_seq OWNED BY public.alert_notification_settings.id;




CREATE TABLE public.alert_settings (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    question_id bigint NOT NULL,
    "column" character varying(255) NOT NULL,
    aggregation integer NOT NULL,
    number_of_rows integer NOT NULL,
    operation integer NOT NULL,
    traversal integer NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    frequency_value_in_seconds integer NOT NULL,
    start_time timestamp(0) without time zone NOT NULL,
    scheduled_disabled_config jsonb,
    silent_till timestamp(0) without time zone,
    next_run_time timestamp(0) without time zone,
    status integer,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);








CREATE SEQUENCE public.alert_settings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.alert_settings_id_seq OWNED BY public.alert_settings.id;






CREATE TABLE public.alerts (
    id bigint NOT NULL,
    name character varying(255),
    config jsonb,
    question_id bigint,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);





-- CREATE TABLE public.__diesel_schema_migrations (
--     version character varying(50) NOT NULL,
--     run_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
-- );




CREATE SEQUENCE public.alerts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.alerts_id_seq OWNED BY public.alerts.id;






CREATE TABLE public.api_action_logs (
    id bigint NOT NULL,
    api_action_id bigint,
    url text NOT NULL,
    request_headers jsonb,
    response_headers jsonb,
    request_body text,
    response_body text,
    request_method integer,
    status_code integer,
    variables character varying(255)[],
    user_id bigint,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);








CREATE SEQUENCE public.api_action_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.api_action_logs_id_seq OWNED BY public.api_action_logs.id;






CREATE TABLE public.api_actions (
    id bigint NOT NULL,
    question_id bigint,
    url text NOT NULL,
    headers jsonb,
    body text,
    method integer,
    name character varying(255),
    color character varying(255),
    open_in_new_tab boolean,
    response_settings jsonb,
    hidden boolean,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    "column" character varying(255),
    on_success integer,
    on_failure integer,
    failure_message character varying(255),
    failure_key character varying(255),
    success_message character varying(255),
    success_key character varying(255),
    action_level integer,
    visualization_id integer,
    loading_message text,
    display_settings jsonb,
    open_option character varying(255)
);








CREATE SEQUENCE public.api_actions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.api_actions_id_seq OWNED BY public.api_actions.id;






CREATE TABLE public.audit_logs (
    id bigint NOT NULL,
    whodunit integer,
    action integer,
    additional_data jsonb,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);








CREATE SEQUENCE public.audit_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


CREATE TABLE public.column_values (
    id bigint NOT NULL,
    name character varying(255),
    value character varying(255),
    column_id bigint,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);








CREATE SEQUENCE public.column_values_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.column_values_id_seq OWNED BY public.column_values.id;






CREATE TABLE public.columns (
    id bigint NOT NULL,
    name character varying(255),
    table_id bigint,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    data_type character varying(255),
    description character varying(255),
    primary_key boolean
);








CREATE SEQUENCE public.columns_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.columns_id_seq OWNED BY public.columns.id;






CREATE TABLE public.dashboard_questions (
    dashboard_id bigint,
    question_id bigint
);








CREATE TABLE public.dashboard_widgets (
    id bigint NOT NULL,
    widget_type character varying(255),
    widget_id bigint,
    dashboard_id bigint,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);








CREATE SEQUENCE public.dashboard_widgets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.dashboard_widgets_id_seq OWNED BY public.dashboard_widgets.id;






CREATE TABLE public.dashboards (
    id bigint NOT NULL,
    title character varying(255),
    update_interval integer,
    last_updated timestamp(0) without time zone,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    description text,
    shareable_link uuid,
    is_shareable_link_public boolean DEFAULT false,
    settings jsonb,
    shared_to character varying(255)[],
    owner_id bigint,
    notes_settings jsonb
);








CREATE SEQUENCE public.dashboards_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.dashboards_id_seq OWNED BY public.dashboards.id;






CREATE TABLE public.databases (
    id bigint NOT NULL,
    name character varying(255),
    db_type character varying(255),
    config jsonb,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    last_accessed_at timestamp(0) without time zone,
    unique_identifier uuid
);








CREATE SEQUENCE public.databases_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.databases_id_seq OWNED BY public.databases.id;






CREATE TABLE public.foreign_keys (
    id bigint NOT NULL,
    name character varying(255),
    fk_type integer,
    column_id bigint,
    foreign_column_id bigint,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);








CREATE SEQUENCE public.foreign_keys_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.foreign_keys_id_seq OWNED BY public.foreign_keys.id;






CREATE TABLE public.generated_alerts (
    id bigint NOT NULL,
    alert_id bigint,
    status integer,
    failing_conditions jsonb[],
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);








CREATE SEQUENCE public.generated_alerts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.generated_alerts_id_seq OWNED BY public.generated_alerts.id;






CREATE TABLE public.notes (
    id bigint NOT NULL,
    content text NOT NULL,
    dashboard_id bigint,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);








CREATE SEQUENCE public.notes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.notes_id_seq OWNED BY public.notes.id;






CREATE TABLE public.oban_jobs (
    id bigint NOT NULL,
    state public.oban_job_state DEFAULT 'available'::public.oban_job_state NOT NULL,
    queue text DEFAULT 'default'::text NOT NULL,
    worker text NOT NULL,
    args jsonb NOT NULL,
    errors jsonb[] DEFAULT ARRAY[]::jsonb[] NOT NULL,
    attempt integer DEFAULT 0 NOT NULL,
    max_attempts integer DEFAULT 20 NOT NULL,
    inserted_at timestamp without time zone DEFAULT timezone('UTC'::text, now()) NOT NULL,
    scheduled_at timestamp without time zone DEFAULT timezone('UTC'::text, now()) NOT NULL,
    attempted_at timestamp without time zone,
    completed_at timestamp without time zone
);








CREATE SEQUENCE public.oban_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.oban_jobs_id_seq OWNED BY public.oban_jobs.id;






CREATE TABLE public.organization_settings (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(255),
    setting_type integer NOT NULL,
    organization_id bigint NOT NULL,
    api_action_id bigint,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);








CREATE SEQUENCE public.organization_settings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.organization_settings_id_seq OWNED BY public.organization_settings.id;






CREATE TABLE public.organizations (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    google_domain character varying(255) NOT NULL,
    is_deactivated boolean DEFAULT false NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);








CREATE SEQUENCE public.organizations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.organizations_id_seq OWNED BY public.organizations.id;






CREATE TABLE public.permission_sets (
    id bigint NOT NULL,
    name character varying(255),
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);








CREATE SEQUENCE public.permission_sets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.permission_sets_id_seq OWNED BY public.permission_sets.id;






CREATE TABLE public.permissions (
    id bigint NOT NULL,
    permission_set_id bigint,
    name character varying(255),
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);








CREATE SEQUENCE public.permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.permissions_id_seq OWNED BY public.permissions.id;






CREATE TABLE public.question_banks (
    id bigint NOT NULL,
    title character varying(255),
    questions integer[],
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);








CREATE SEQUENCE public.question_banks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.question_banks_id_seq OWNED BY public.question_banks.id;






CREATE TABLE public.question_widgets (
    id bigint NOT NULL,
    widget_id bigint,
    question_id bigint
);








CREATE SEQUENCE public.question_widgets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.question_widgets_id_seq OWNED BY public.question_widgets.id;






CREATE TABLE public.questions (
    id bigint NOT NULL,
    title character varying(255),
    last_updated timestamp(0) without time zone,
    sql text,
    human_sql jsonb,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    query_type integer,
    shareable_link uuid,
    is_shareable_link_public boolean DEFAULT false,
    results_view_settings jsonb,
    columns character varying(255)[],
    cached_results jsonb,
    shared_to character varying(255)[],
    owner_id bigint,
    config jsonb
);








CREATE SEQUENCE public.questions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.questions_id_seq OWNED BY public.questions.id;






CREATE TABLE public.results_cache (
    id bigint NOT NULL,
    key character varying(255),
    sql text,
    data jsonb,
    expiry_time timestamp(0) without time zone,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);








CREATE SEQUENCE public.results_cache_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.results_cache_id_seq OWNED BY public.results_cache.id;






CREATE TABLE public.schedules (
    id bigint NOT NULL,
    every integer,
    time_unit character varying(255),
    time_details jsonb[],
    next_execution_time timestamp(0) without time zone,
    is_running boolean,
    job_details jsonb,
    is_active boolean,
    recipients character varying(255)[],
    timezone character varying(255),
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);




CREATE SEQUENCE public.schedules_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.schedules_id_seq OWNED BY public.schedules.id;






CREATE TABLE public.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);








CREATE TABLE public.searchable_columns (
    id bigint NOT NULL,
    name character varying(255),
    snapshot_id bigint,
    value text,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    snapshot_data_identifier uuid
);








CREATE SEQUENCE public.searchable_columns_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.searchable_columns_id_seq OWNED BY public.searchable_columns.id;






CREATE TABLE public.send_alert_configs (
    id bigint NOT NULL,
    alert_id bigint,
    message_template character varying(255),
    comm_type integer,
    to_addresses character varying(255)[],
    subject_template character varying(255),
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);








CREATE SEQUENCE public.send_alert_configs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.send_alert_configs_id_seq OWNED BY public.send_alert_configs.id;






CREATE TABLE public.settings (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    value text,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);








CREATE SEQUENCE public.settings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.settings_id_seq OWNED BY public.settings.id;






CREATE TABLE public.sheet_configs (
    id bigint NOT NULL,
    name character varying(255),
    table_name character varying(255),
    refresh_interval integer,
    sheet_id character varying(255),
    subsheet_id integer,
    api_key_id bigint,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);








CREATE SEQUENCE public.sheet_configs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.sheet_configs_id_seq OWNED BY public.sheet_configs.id;






CREATE TABLE public.snapshot_data (
    id bigint NOT NULL,
    "row" jsonb NOT NULL,
    snapshot_id bigint,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    identifier uuid
);








CREATE SEQUENCE public.snapshot_data_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.snapshot_data_id_seq OWNED BY public.snapshot_data.id;






CREATE TABLE public.snapshots (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    columns character varying(255)[],
    question_id bigint NOT NULL,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    scheduled boolean,
    "interval" integer,
    starting_at timestamp(0) without time zone,
    status integer,
    should_save_data_to_db boolean,
    should_create_csv boolean,
    should_send_mail_on_completion boolean,
    mail_to character varying(255)[],
    parent_id bigint,
    searchable_columns character varying(255)[],
    keep_latest integer
);








CREATE SEQUENCE public.snapshots_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.snapshots_id_seq OWNED BY public.snapshots.id;






CREATE TABLE public.snippets (
    id bigint NOT NULL,
    name character varying(255),
    text text,
    database_id bigint,
    owner_id bigint,
    expand_on_select boolean,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);








CREATE SEQUENCE public.snippets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.snippets_id_seq OWNED BY public.snippets.id;






CREATE TABLE public.tables (
    id bigint NOT NULL,
    name character varying(255),
    database_id bigint,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    readable_table_name character varying(255),
    description character varying(255)
);








CREATE SEQUENCE public.tables_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.tables_id_seq OWNED BY public.tables.id;






CREATE TABLE public.tag_dashboards (
    id bigint NOT NULL,
    tag_id bigint,
    dashboard_id bigint,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);








CREATE SEQUENCE public.tag_dashboards_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.tag_dashboards_id_seq OWNED BY public.tag_dashboards.id;






CREATE TABLE public.tag_questions (
    id bigint NOT NULL,
    tag_id bigint,
    question_id bigint,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);








CREATE SEQUENCE public.tag_questions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.tag_questions_id_seq OWNED BY public.tag_questions.id;






CREATE TABLE public.tags (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    color character varying(255)
);








CREATE SEQUENCE public.tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;






CREATE TABLE public.team_databases (
    id bigint NOT NULL,
    database_id bigint,
    team_id bigint,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);








CREATE SEQUENCE public.team_databases_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.team_databases_id_seq OWNED BY public.team_databases.id;



CREATE TABLE public.teams (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);








CREATE SEQUENCE public.teams_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.teams_id_seq OWNED BY public.teams.id;






CREATE TABLE public.user_permission_sets (
    id bigint NOT NULL,
    user_id bigint,
    permission_set_id bigint,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);








CREATE SEQUENCE public.user_permission_sets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.user_permission_sets_id_seq OWNED BY public.user_permission_sets.id;






CREATE TABLE public.user_settings (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    value character varying(255),
    setting_type integer NOT NULL,
    user_id bigint NOT NULL,
    api_action_id bigint,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);








CREATE SEQUENCE public.user_settings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.user_settings_id_seq OWNED BY public.user_settings.id;






CREATE TABLE public.user_teams (
    id bigint NOT NULL,
    user_id bigint,
    team_id bigint,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);








CREATE SEQUENCE public.user_teams_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.user_teams_id_seq OWNED BY public.user_teams.id;






CREATE TABLE public.users (
    id bigint NOT NULL,
    first_name character varying(255),
    last_name character varying(255),
    email character varying(255),
    full_name character varying(255),
    profile_pic character varying(255),
    metadata jsonb,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    is_deactivated boolean,
    organization_id bigint,
    password text
);








CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;






CREATE TABLE public.variables (
    id bigint NOT NULL,
    name character varying(255),
    "default" character varying(255),
    var_type character varying(255),
    column_id bigint,
    question_id bigint,
    dashboard_id bigint,
    default_operator character varying(255),
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL,
    question_filter_id bigint,
    default_options jsonb[]
);








CREATE SEQUENCE public.variables_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.variables_id_seq OWNED BY public.variables.id;






CREATE TABLE public.visualizations (
    id bigint NOT NULL,
    name character varying(255),
    settings jsonb,
    query_terms jsonb,
    renderer_type character varying(255),
    question_id bigint,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);








CREATE SEQUENCE public.visualizations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.visualizations_id_seq OWNED BY public.visualizations.id;






CREATE TABLE public.widget_items (
    id bigint NOT NULL,
    text character varying(255),
    config jsonb,
    value character varying(255),
    widget_id bigint,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);








CREATE SEQUENCE public.widget_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.widget_items_id_seq OWNED BY public.widget_items.id;






CREATE TABLE public.widgets (
    id bigint NOT NULL,
    column_name character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    renderer integer,
    inserted_at timestamp(0) without time zone NOT NULL,
    updated_at timestamp(0) without time zone NOT NULL
);








CREATE SEQUENCE public.widgets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;








ALTER SEQUENCE public.widgets_id_seq OWNED BY public.widgets.id;






ALTER TABLE ONLY public.alert_events ALTER COLUMN id SET DEFAULT nextval('public.alert_events_id_seq'::regclass);






ALTER TABLE ONLY public.alert_events_transformed_data ALTER COLUMN id SET DEFAULT nextval('public.alert_events_transformed_data_id_seq'::regclass);






ALTER TABLE ONLY public.alert_level_settings ALTER COLUMN id SET DEFAULT nextval('public.alert_level_settings_id_seq'::regclass);






ALTER TABLE ONLY public.alert_notification_settings ALTER COLUMN id SET DEFAULT nextval('public.alert_notification_settings_id_seq'::regclass);






ALTER TABLE ONLY public.alert_settings ALTER COLUMN id SET DEFAULT nextval('public.alert_settings_id_seq'::regclass);






ALTER TABLE ONLY public.alerts ALTER COLUMN id SET DEFAULT nextval('public.alerts_id_seq'::regclass);






ALTER TABLE ONLY public.api_action_logs ALTER COLUMN id SET DEFAULT nextval('public.api_action_logs_id_seq'::regclass);






ALTER TABLE ONLY public.api_actions ALTER COLUMN id SET DEFAULT nextval('public.api_actions_id_seq'::regclass);






ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);






ALTER TABLE ONLY public.column_values ALTER COLUMN id SET DEFAULT nextval('public.column_values_id_seq'::regclass);






ALTER TABLE ONLY public.columns ALTER COLUMN id SET DEFAULT nextval('public.columns_id_seq'::regclass);






ALTER TABLE ONLY public.dashboard_widgets ALTER COLUMN id SET DEFAULT nextval('public.dashboard_widgets_id_seq'::regclass);






ALTER TABLE ONLY public.dashboards ALTER COLUMN id SET DEFAULT nextval('public.dashboards_id_seq'::regclass);






ALTER TABLE ONLY public.databases ALTER COLUMN id SET DEFAULT nextval('public.databases_id_seq'::regclass);






ALTER TABLE ONLY public.foreign_keys ALTER COLUMN id SET DEFAULT nextval('public.foreign_keys_id_seq'::regclass);






ALTER TABLE ONLY public.generated_alerts ALTER COLUMN id SET DEFAULT nextval('public.generated_alerts_id_seq'::regclass);






ALTER TABLE ONLY public.notes ALTER COLUMN id SET DEFAULT nextval('public.notes_id_seq'::regclass);






ALTER TABLE ONLY public.oban_jobs ALTER COLUMN id SET DEFAULT nextval('public.oban_jobs_id_seq'::regclass);






ALTER TABLE ONLY public.organization_settings ALTER COLUMN id SET DEFAULT nextval('public.organization_settings_id_seq'::regclass);






ALTER TABLE ONLY public.organizations ALTER COLUMN id SET DEFAULT nextval('public.organizations_id_seq'::regclass);






ALTER TABLE ONLY public.permission_sets ALTER COLUMN id SET DEFAULT nextval('public.permission_sets_id_seq'::regclass);






ALTER TABLE ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);






ALTER TABLE ONLY public.question_banks ALTER COLUMN id SET DEFAULT nextval('public.question_banks_id_seq'::regclass);






ALTER TABLE ONLY public.question_widgets ALTER COLUMN id SET DEFAULT nextval('public.question_widgets_id_seq'::regclass);






ALTER TABLE ONLY public.questions ALTER COLUMN id SET DEFAULT nextval('public.questions_id_seq'::regclass);






ALTER TABLE ONLY public.results_cache ALTER COLUMN id SET DEFAULT nextval('public.results_cache_id_seq'::regclass);






ALTER TABLE ONLY public.schedules ALTER COLUMN id SET DEFAULT nextval('public.schedules_id_seq'::regclass);






ALTER TABLE ONLY public.searchable_columns ALTER COLUMN id SET DEFAULT nextval('public.searchable_columns_id_seq'::regclass);






ALTER TABLE ONLY public.send_alert_configs ALTER COLUMN id SET DEFAULT nextval('public.send_alert_configs_id_seq'::regclass);






ALTER TABLE ONLY public.settings ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass);






ALTER TABLE ONLY public.sheet_configs ALTER COLUMN id SET DEFAULT nextval('public.sheet_configs_id_seq'::regclass);






ALTER TABLE ONLY public.snapshot_data ALTER COLUMN id SET DEFAULT nextval('public.snapshot_data_id_seq'::regclass);






ALTER TABLE ONLY public.snapshots ALTER COLUMN id SET DEFAULT nextval('public.snapshots_id_seq'::regclass);






ALTER TABLE ONLY public.snippets ALTER COLUMN id SET DEFAULT nextval('public.snippets_id_seq'::regclass);






ALTER TABLE ONLY public.tables ALTER COLUMN id SET DEFAULT nextval('public.tables_id_seq'::regclass);






ALTER TABLE ONLY public.tag_dashboards ALTER COLUMN id SET DEFAULT nextval('public.tag_dashboards_id_seq'::regclass);






ALTER TABLE ONLY public.tag_questions ALTER COLUMN id SET DEFAULT nextval('public.tag_questions_id_seq'::regclass);






ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);






ALTER TABLE ONLY public.team_databases ALTER COLUMN id SET DEFAULT nextval('public.team_databases_id_seq'::regclass);






ALTER TABLE ONLY public.teams ALTER COLUMN id SET DEFAULT nextval('public.teams_id_seq'::regclass);






ALTER TABLE ONLY public.user_permission_sets ALTER COLUMN id SET DEFAULT nextval('public.user_permission_sets_id_seq'::regclass);






ALTER TABLE ONLY public.user_settings ALTER COLUMN id SET DEFAULT nextval('public.user_settings_id_seq'::regclass);






ALTER TABLE ONLY public.user_teams ALTER COLUMN id SET DEFAULT nextval('public.user_teams_id_seq'::regclass);






ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);






ALTER TABLE ONLY public.variables ALTER COLUMN id SET DEFAULT nextval('public.variables_id_seq'::regclass);






ALTER TABLE ONLY public.visualizations ALTER COLUMN id SET DEFAULT nextval('public.visualizations_id_seq'::regclass);






ALTER TABLE ONLY public.widget_items ALTER COLUMN id SET DEFAULT nextval('public.widget_items_id_seq'::regclass);






ALTER TABLE ONLY public.widgets ALTER COLUMN id SET DEFAULT nextval('public.widgets_id_seq'::regclass);






-- ALTER TABLE ONLY public.__diesel_schema_migrations
--     ADD CONSTRAINT __diesel_schema_migrations_pkey PRIMARY KEY (version);






ALTER TABLE ONLY public.alert_events
    ADD CONSTRAINT alert_events_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.alert_events_transformed_data
    ADD CONSTRAINT alert_events_transformed_data_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.alert_level_settings
    ADD CONSTRAINT alert_level_settings_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.alert_notification_settings
    ADD CONSTRAINT alert_notification_settings_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.alert_settings
    ADD CONSTRAINT alert_settings_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.api_action_logs
    ADD CONSTRAINT api_action_logs_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.api_actions
    ADD CONSTRAINT api_actions_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.column_values
    ADD CONSTRAINT column_values_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.columns
    ADD CONSTRAINT columns_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.dashboard_widgets
    ADD CONSTRAINT dashboard_widgets_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.dashboards
    ADD CONSTRAINT dashboards_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.databases
    ADD CONSTRAINT databases_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.foreign_keys
    ADD CONSTRAINT foreign_keys_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.generated_alerts
    ADD CONSTRAINT generated_alerts_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.oban_jobs
    ADD CONSTRAINT oban_jobs_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.organization_settings
    ADD CONSTRAINT organization_settings_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.permission_sets
    ADD CONSTRAINT permission_sets_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.question_banks
    ADD CONSTRAINT question_banks_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.question_widgets
    ADD CONSTRAINT question_widgets_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.results_cache
    ADD CONSTRAINT results_cache_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);






ALTER TABLE ONLY public.searchable_columns
    ADD CONSTRAINT searchable_columns_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.send_alert_configs
    ADD CONSTRAINT send_alert_configs_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.sheet_configs
    ADD CONSTRAINT sheet_configs_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.snapshot_data
    ADD CONSTRAINT snapshot_data_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.snapshots
    ADD CONSTRAINT snapshots_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.snippets
    ADD CONSTRAINT snippets_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.tables
    ADD CONSTRAINT tables_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.tag_dashboards
    ADD CONSTRAINT tag_dashboards_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.tag_questions
    ADD CONSTRAINT tag_questions_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.team_databases
    ADD CONSTRAINT team_databases_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.user_permission_sets
    ADD CONSTRAINT user_permission_sets_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.user_settings
    ADD CONSTRAINT user_settings_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.user_teams
    ADD CONSTRAINT user_teams_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.variables
    ADD CONSTRAINT variables_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.visualizations
    ADD CONSTRAINT visualizations_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.widget_items
    ADD CONSTRAINT widget_items_pkey PRIMARY KEY (id);






ALTER TABLE ONLY public.widgets
    ADD CONSTRAINT widgets_pkey PRIMARY KEY (id);






CREATE UNIQUE INDEX alert_level_settings_level_alert_setting_id_index ON public.alert_level_settings USING btree (level, alert_setting_id);






CREATE UNIQUE INDEX alert_notification_settings_method_recipients_alert_setting_id_ ON public.alert_notification_settings USING btree (method, recipients, alert_setting_id);






CREATE INDEX column_name_trgram_index ON public.columns USING gin (name public.gin_trgm_ops);






CREATE INDEX column_values_column_id_index ON public.column_values USING btree (column_id);






CREATE UNIQUE INDEX column_values_column_id_value_index ON public.column_values USING btree (column_id, value);






CREATE INDEX columns_name_trgram_index ON public.columns USING gin (name public.gin_trgm_ops);






CREATE INDEX columns_table_id_index ON public.columns USING btree (table_id);






CREATE INDEX dashboard_title_trgram_index ON public.dashboards USING gin (title public.gin_trgm_ops);






CREATE INDEX dashboards_owner_id_index ON public.dashboards USING btree (owner_id);






CREATE INDEX dashboards_shared_to_index ON public.dashboards USING gin (shared_to);






CREATE INDEX database_name_trgram_index ON public.databases USING gin (name public.gin_trgm_ops);






CREATE UNIQUE INDEX fk_column_id_foreign_column_id_index ON public.foreign_keys USING btree (column_id, foreign_column_id);







CREATE INDEX oban_jobs_queue_index ON public.oban_jobs USING btree (queue);






CREATE INDEX oban_jobs_scheduled_at_index ON public.oban_jobs USING btree (scheduled_at);






CREATE INDEX oban_jobs_state_index ON public.oban_jobs USING btree (state);






CREATE UNIQUE INDEX organization_settings_name_organization_id_index ON public.organization_settings USING btree (name, organization_id);






CREATE UNIQUE INDEX organizations_google_domain_index ON public.organizations USING btree (google_domain);






CREATE UNIQUE INDEX organizations_name_index ON public.organizations USING btree (name);






CREATE UNIQUE INDEX permission_sets_name_index ON public.permission_sets USING btree (name);






CREATE UNIQUE INDEX permissions_name_permission_set_id_index ON public.permissions USING btree (name, permission_set_id);






CREATE INDEX questions_owner_id_index ON public.questions USING btree (owner_id);






CREATE INDEX questions_shared_to_index ON public.questions USING gin (shared_to);






CREATE INDEX questions_sql_trgram_index ON public.questions USING gin (sql public.gin_trgm_ops);






CREATE INDEX questions_title_trgram_index ON public.questions USING gin (title public.gin_trgm_ops);






CREATE INDEX results_cache_key_sql_index ON public.results_cache USING btree (key, sql);






CREATE INDEX schedules_is_active_is_running_next_execution_time_index ON public.schedules USING btree (is_active, is_running, next_execution_time);






CREATE INDEX searchable_columns_name_snapshot_id_value_trgram_index ON public.searchable_columns USING gist (snapshot_id, name, value public.gist_trgm_ops);






CREATE INDEX searchable_columns_snapshot_id_name_value_index ON public.searchable_columns USING btree (snapshot_id, name, value);






CREATE UNIQUE INDEX settings_name_index ON public.settings USING btree (name);






CREATE INDEX sheet_configs_api_key_id_index ON public.sheet_configs USING btree (api_key_id);






CREATE INDEX snapshot_data_identifier_index ON public.snapshot_data USING btree (identifier);






CREATE INDEX snapshot_data_snapshot_id_index ON public.snapshot_data USING btree (snapshot_id);






CREATE INDEX snapshots_question_id_index ON public.snapshots USING btree (question_id);






CREATE UNIQUE INDEX snapshots_question_id_starting_at_index ON public.snapshots USING btree (question_id, starting_at);






CREATE INDEX snippets_database_id_index ON public.snippets USING btree (database_id);






CREATE UNIQUE INDEX snippets_name_database_id_index ON public.snippets USING btree (name, database_id);






CREATE INDEX snippets_owner_id_index ON public.snippets USING btree (owner_id);






CREATE INDEX snippets_text_trgram_index ON public.snippets USING gin (text public.gin_trgm_ops);






CREATE INDEX table_name_trgram_index ON public.tables USING gin (name public.gin_trgm_ops);






CREATE INDEX tables_database_id_index ON public.tables USING btree (database_id);






CREATE INDEX tables_name_trgram_index ON public.tables USING gin (name public.gin_trgm_ops);






CREATE UNIQUE INDEX tag_dashboards_tag_id_dashboard_id_index ON public.tag_dashboards USING btree (tag_id, dashboard_id);






CREATE UNIQUE INDEX tag_questions_tag_id_question_id_index ON public.tag_questions USING btree (tag_id, question_id);






CREATE UNIQUE INDEX tags_name_index ON public.tags USING btree (name);






CREATE UNIQUE INDEX team_databases_database_id_team_id_index ON public.team_databases USING btree (database_id, team_id);



CREATE UNIQUE INDEX teams_name_index ON public.teams USING btree (name);






CREATE UNIQUE INDEX user_permission_sets_user_id_permission_set_id_index ON public.user_permission_sets USING btree (user_id, permission_set_id);






CREATE UNIQUE INDEX user_settings_name_user_id_index ON public.user_settings USING btree (name, user_id);






CREATE UNIQUE INDEX user_teams_user_id_team_id_index ON public.user_teams USING btree (user_id, team_id);






CREATE UNIQUE INDEX users_email_index ON public.users USING btree (email);






CREATE INDEX users_email_trgram_index ON public.users USING gin (email public.gin_trgm_ops);






CREATE UNIQUE INDEX variables_name_question_id_index ON public.variables USING btree (name, question_id);






CREATE INDEX visualizations_question_id_index ON public.visualizations USING btree (question_id);






CREATE INDEX widgets_name_trgram_index ON public.widgets USING gin (name public.gin_trgm_ops);






-- CREATE TRIGGER oban_notify AFTER INSERT OR UPDATE ON public.oban_jobs FOR EACH ROW EXECUTE FUNCTION public.oban_jobs_notify();






ALTER TABLE ONLY public.alert_events
    ADD CONSTRAINT alert_events_alert_setting_id_fkey FOREIGN KEY (alert_setting_id) REFERENCES public.alert_settings(id) ON DELETE CASCADE;






ALTER TABLE ONLY public.alert_events_transformed_data
    ADD CONSTRAINT alert_events_transformed_data_alert_event_id_fkey FOREIGN KEY (alert_event_id) REFERENCES public.alert_events(id) ON DELETE CASCADE;






ALTER TABLE ONLY public.alert_level_settings
    ADD CONSTRAINT alert_level_settings_alert_setting_id_fkey FOREIGN KEY (alert_setting_id) REFERENCES public.alert_settings(id) ON DELETE CASCADE;






ALTER TABLE ONLY public.alert_notification_settings
    ADD CONSTRAINT alert_notification_settings_alert_setting_id_fkey FOREIGN KEY (alert_setting_id) REFERENCES public.alert_settings(id) ON DELETE CASCADE;






ALTER TABLE ONLY public.alert_settings
    ADD CONSTRAINT alert_settings_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;






ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id);






ALTER TABLE ONLY public.api_action_logs
    ADD CONSTRAINT api_action_logs_api_action_id_fkey FOREIGN KEY (api_action_id) REFERENCES public.api_actions(id) ON DELETE CASCADE;






ALTER TABLE ONLY public.api_action_logs
    ADD CONSTRAINT api_action_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);






ALTER TABLE ONLY public.api_actions
    ADD CONSTRAINT api_actions_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;






ALTER TABLE ONLY public.column_values
    ADD CONSTRAINT column_values_column_id_fkey FOREIGN KEY (column_id) REFERENCES public.columns(id) ON DELETE CASCADE;






ALTER TABLE ONLY public.columns
    ADD CONSTRAINT columns_table_id_fkey FOREIGN KEY (table_id) REFERENCES public.tables(id) ON DELETE CASCADE;






ALTER TABLE ONLY public.dashboard_questions
    ADD CONSTRAINT dashboard_questions_dashboard_id_fkey FOREIGN KEY (dashboard_id) REFERENCES public.dashboards(id);






ALTER TABLE ONLY public.dashboard_questions
    ADD CONSTRAINT dashboard_questions_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id);






ALTER TABLE ONLY public.dashboard_widgets
    ADD CONSTRAINT dashboard_widgets_dashboard_id_fkey FOREIGN KEY (dashboard_id) REFERENCES public.dashboards(id) ON DELETE CASCADE;






ALTER TABLE ONLY public.dashboards
    ADD CONSTRAINT dashboards_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id);






ALTER TABLE ONLY public.foreign_keys
    ADD CONSTRAINT foreign_keys_column_id_fkey FOREIGN KEY (column_id) REFERENCES public.columns(id) ON DELETE CASCADE;






ALTER TABLE ONLY public.foreign_keys
    ADD CONSTRAINT foreign_keys_foreign_column_id_fkey FOREIGN KEY (foreign_column_id) REFERENCES public.columns(id) ON DELETE CASCADE;






ALTER TABLE ONLY public.generated_alerts
    ADD CONSTRAINT generated_alerts_alert_id_fkey FOREIGN KEY (alert_id) REFERENCES public.alerts(id);






ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_dashboard_id_fkey FOREIGN KEY (dashboard_id) REFERENCES public.dashboards(id) ON DELETE CASCADE;






ALTER TABLE ONLY public.organization_settings
    ADD CONSTRAINT organization_settings_api_action_id_fkey FOREIGN KEY (api_action_id) REFERENCES public.api_actions(id) ON DELETE CASCADE;






ALTER TABLE ONLY public.organization_settings
    ADD CONSTRAINT organization_settings_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;






ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_permission_set_id_fkey FOREIGN KEY (permission_set_id) REFERENCES public.permission_sets(id) ON DELETE CASCADE;






ALTER TABLE ONLY public.question_widgets
    ADD CONSTRAINT question_widgets_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id);






ALTER TABLE ONLY public.question_widgets
    ADD CONSTRAINT question_widgets_widget_id_fkey FOREIGN KEY (widget_id) REFERENCES public.widgets(id);






ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id);






ALTER TABLE ONLY public.searchable_columns
    ADD CONSTRAINT searchable_columns_snapshot_id_fkey FOREIGN KEY (snapshot_id) REFERENCES public.snapshots(id) ON DELETE CASCADE;






ALTER TABLE ONLY public.send_alert_configs
    ADD CONSTRAINT send_alert_configs_alert_id_fkey FOREIGN KEY (alert_id) REFERENCES public.alerts(id);






ALTER TABLE ONLY public.sheet_configs
    ADD CONSTRAINT sheet_configs_api_key_id_fkey FOREIGN KEY (api_key_id) REFERENCES public.user_settings(id);






ALTER TABLE ONLY public.snapshot_data
    ADD CONSTRAINT snapshot_data_snapshot_id_fkey FOREIGN KEY (snapshot_id) REFERENCES public.snapshots(id) ON DELETE CASCADE;






ALTER TABLE ONLY public.snapshots
    ADD CONSTRAINT snapshots_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.snapshots(id);






ALTER TABLE ONLY public.snapshots
    ADD CONSTRAINT snapshots_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;






ALTER TABLE ONLY public.snippets
    ADD CONSTRAINT snippets_database_id_fkey FOREIGN KEY (database_id) REFERENCES public.databases(id) ON DELETE CASCADE;






ALTER TABLE ONLY public.snippets
    ADD CONSTRAINT snippets_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id);






ALTER TABLE ONLY public.tables
    ADD CONSTRAINT tables_database_id_fkey FOREIGN KEY (database_id) REFERENCES public.databases(id) ON DELETE CASCADE;






ALTER TABLE ONLY public.tag_dashboards
    ADD CONSTRAINT tag_dashboards_dashboard_id_fkey FOREIGN KEY (dashboard_id) REFERENCES public.dashboards(id);






ALTER TABLE ONLY public.tag_dashboards
    ADD CONSTRAINT tag_dashboards_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id);






ALTER TABLE ONLY public.tag_questions
    ADD CONSTRAINT tag_questions_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id);






ALTER TABLE ONLY public.tag_questions
    ADD CONSTRAINT tag_questions_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id);






ALTER TABLE ONLY public.team_databases
    ADD CONSTRAINT team_databases_database_id_fkey FOREIGN KEY (database_id) REFERENCES public.databases(id) ON DELETE CASCADE;






ALTER TABLE ONLY public.team_databases
    ADD CONSTRAINT team_databases_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;






ALTER TABLE ONLY public.user_permission_sets
    ADD CONSTRAINT user_permission_sets_permission_set_id_fkey FOREIGN KEY (permission_set_id) REFERENCES public.permission_sets(id) ON DELETE CASCADE;






ALTER TABLE ONLY public.user_permission_sets
    ADD CONSTRAINT user_permission_sets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;






ALTER TABLE ONLY public.user_settings
    ADD CONSTRAINT user_settings_api_action_id_fkey FOREIGN KEY (api_action_id) REFERENCES public.api_actions(id) ON DELETE CASCADE;






ALTER TABLE ONLY public.user_settings
    ADD CONSTRAINT user_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;






ALTER TABLE ONLY public.user_teams
    ADD CONSTRAINT user_teams_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE;






ALTER TABLE ONLY public.user_teams
    ADD CONSTRAINT user_teams_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;






ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE CASCADE;






ALTER TABLE ONLY public.variables
    ADD CONSTRAINT variables_column_id_fkey FOREIGN KEY (column_id) REFERENCES public.columns(id) ON DELETE CASCADE;






ALTER TABLE ONLY public.variables
    ADD CONSTRAINT variables_dashboard_id_fkey FOREIGN KEY (dashboard_id) REFERENCES public.dashboards(id) ON DELETE CASCADE;






ALTER TABLE ONLY public.variables
    ADD CONSTRAINT variables_question_filter_id_fkey FOREIGN KEY (question_filter_id) REFERENCES public.questions(id);






ALTER TABLE ONLY public.variables
    ADD CONSTRAINT variables_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;






ALTER TABLE ONLY public.visualizations
    ADD CONSTRAINT visualizations_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id);






ALTER TABLE ONLY public.widget_items
    ADD CONSTRAINT widget_items_widget_id_fkey FOREIGN KEY (widget_id) REFERENCES public.widgets(id) ON DELETE CASCADE;






END IF;
END $$;
